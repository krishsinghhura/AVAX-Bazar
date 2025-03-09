// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LoanPool {
    struct Loan {
        address borrower;
        uint256 amount;
        uint256 collateralAmount;
        address collateralToken;
        uint256 interestRate;
        uint256 borrowTime;
        uint256 dueDate;
        bool repaid;
    }

    struct Deposit {
        uint256 amount;
        uint256 depositTime;
    }

    mapping(address => Deposit) public deposits;
    mapping(address => Loan) public loans;
    uint256 public interestRate = 5; // 0.5% daily interest
    uint256 public lenderRate = 2; // 0.2% daily interest for lenders
    uint256 public totalDeposits;
    address public owner;

    event Deposited(address indexed lender, uint256 amount);
    event Borrowed(
        address indexed borrower,
        uint256 amount,
        address collateralToken,
        uint256 collateralAmount
    );
    event Repaid(address indexed borrower, uint256 amount);
    event Liquidated(
        address indexed borrower,
        address liquidator,
        address collateralToken,
        uint256 collateralAmount
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    modifier nonReentrant() {
        require(lock == 0, "Reentrant call");
        lock = 1;
        _;
        lock = 0;
    }

    uint256 private lock;

    constructor() {
        owner = msg.sender;
    }

    function depositFunds() external payable nonReentrant {
        require(msg.value > 0, "Deposit must be greater than 0");

        totalDeposits += msg.value;
        deposits[msg.sender].amount += msg.value;
        deposits[msg.sender].depositTime = block.timestamp;

        emit Deposited(msg.sender, msg.value);
    }

    function borrowFunds(
        uint256 _amount,
        address _collateralToken,
        uint256 _collateralAmount
    ) external nonReentrant {
        require(totalDeposits >= _amount, "Insufficient liquidity in pool");
        require(
            loans[msg.sender].amount == 0,
            "Existing loan must be repaid first"
        );

        IERC20 collateral = IERC20(_collateralToken);
        require(
            collateral.allowance(msg.sender, address(this)) >=
                _collateralAmount,
            "Collateral not approved"
        );
        require(
            collateral.transferFrom(
                msg.sender,
                address(this),
                _collateralAmount
            ),
            "Collateral transfer failed"
        );

        loans[msg.sender] = Loan({
            borrower: msg.sender,
            amount: _amount,
            collateralAmount: _collateralAmount,
            collateralToken: _collateralToken,
            interestRate: interestRate,
            borrowTime: block.timestamp,
            dueDate: block.timestamp + 7 days,
            repaid: false
        });

        totalDeposits -= _amount;
        payable(msg.sender).transfer(_amount);

        emit Borrowed(msg.sender, _amount, _collateralToken, _collateralAmount);
    }

    function repayLoan() external payable nonReentrant {
        Loan storage loan = loans[msg.sender];
        require(loan.amount > 0, "No active loan found");
        require(block.timestamp <= loan.dueDate, "Loan is overdue");

        uint256 totalDue = loan.amount +
            (((loan.amount * loan.interestRate) / 1000) *
                ((block.timestamp - loan.borrowTime) / 86400));
        require(msg.value >= totalDue, "Insufficient repayment amount");

        totalDeposits += totalDue;
        loan.repaid = true;

        IERC20 collateral = IERC20(loan.collateralToken);
        require(
            collateral.transfer(msg.sender, loan.collateralAmount),
            "Collateral return failed"
        );

        emit Repaid(msg.sender, msg.value);
    }

    function withdrawFunds() external nonReentrant {
        Deposit storage deposit = deposits[msg.sender];
        require(deposit.amount > 0, "No funds available");

        uint256 duration = (block.timestamp - deposit.depositTime) / 1 days;
        uint256 interestEarned = ((deposit.amount * lenderRate) / 1000) *
            duration;
        uint256 withdrawable = deposit.amount + interestEarned;

        require(
            address(this).balance >= withdrawable,
            "Not enough AVAX in pool"
        );

        totalDeposits -= deposit.amount;
        delete deposits[msg.sender];
        payable(msg.sender).transfer(withdrawable);
    }

    function liquidateLoan(address _borrower) external nonReentrant {
        Loan storage loan = loans[_borrower];
        require(loan.amount > 0, "No active loan");
        require(block.timestamp > loan.dueDate, "Loan is not overdue yet");
        require(!loan.repaid, "Loan already repaid");

        IERC20 collateral = IERC20(loan.collateralToken);
        require(
            collateral.transfer(msg.sender, loan.collateralAmount),
            "Collateral liquidation failed"
        );

        emit Liquidated(
            _borrower,
            msg.sender,
            loan.collateralToken,
            loan.collateralAmount
        );

        delete loans[_borrower];
    }
}

interface IERC20 {
    function transfer(
        address recipient,
        uint256 amount
    ) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    function allowance(
        address owner,
        address spender
    ) external view returns (uint256);
}
