pragma solidity  >=0.4.21 <0.7.0;

/*contract Election {
    // Model a Candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }
    // Store accounts that have voted
    mapping(address => bool) public voters;
    // Store Candidates
    // Fetch Candidate
    mapping(uint => Candidate) public candidates;
    // Store Candidates Count
    uint public candidatesCount;
    // voted event
    event votedEvent (
        uint indexed _candidateId
    );
    constructor () public {
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }
    function addCandidate (string memory _name) private {
        candidatesCount ++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }
    function vote (uint _candidateId) public {
        // require that they haven't voted before
        require(!voters[msg.sender],"");
        // require a valid candidate
        require(_candidateId > 0 && _candidateId <= candidatesCount,"");
        // record that voter has voted
        voters[msg.sender] = true;
        // update candidate vote Count
        candidates[_candidateId].voteCount ++;
        // trigger voted event
        emit votedEvent(_candidateId);
    }
}*/

contract Election {

    //candidate model
    struct Candidate {
        string uid;
        uint voteCount;
        string party;
        uint id;
    }

    //store and fetch candidates
    mapping(uint => Candidate) public candidates;

    //no of candidates for later accessing
    uint public candidatesCount;

    //aadhar database
    struct adhar {
        string name;
        string dob;
        string fname;
        string adrs;
        string uid;
        address account;

    }

    //keeping track of no of voters
    uint public voterCount;

    //aadhar database
    mapping(string => adhar) public mydb;

    //voter enrollment mapping
    mapping(string => bool) public isEnrolled;

    //enrolled voters
    function setEnroll(string  memory _uid) public {
        isEnrolled[_uid] = true;

    }

    //candidate enrollment mapping
    mapping(string => bool) public isEnrolledcd;
    //for unique party
    mapping(string => bool) public isPartyEnrolled;

    //enrolled candidates
    function setEnrollcd(string memory _uid,string memory _party) public {

        isEnrolledcd[_uid] = true;
        if(keccak256(abi.encode(_party)) != keccak256("ind") ) {
         isPartyEnrolled[_party] = true;
        }
        candidatesCount++;
        candidates[candidatesCount] = Candidate(_uid,0,_party,candidatesCount);

    }

    constructor() public {
        addVoter("abhishek kumar singh","08/03/1999","as koranga","bangalore","895629728860",0x1616B75799905270016AB93C8979c6541f398bA1);
        addVoter("john smith","03/08/1999","ken smith","new york","895629728861",0xf7C0809fD2338cD08e5058ca5EB522263a51D6Fe);
        addVoter("bharat shaurya","15/03/1998","ram lal","patna","895629728862",0x2B1f09D9df3a675E927F3B89B8F90708B167A22b);
        addVoter("bisan pant","29/09/1997","kisan pant","haldwani","895629728863",0x67fEbc100804d847B90373180cA0F432e4986473);
        addVoter("rohit negi","20/12/1999","shiv negi","baijnath","895629728864",0x24c5F8904C8054aFeE691a9F14D5C0D1CEd02894);
        addVoter("debanik saha","12/06/1998","dp saha","kolkata","895629728865",0x94E01f0831E5C5A44Ad9cb2aFbFc42361fe5AF71);
        addVoter("vinnet panwar","24/08/1999","ap panwar","tehri","895629728866",0xb22A6C5F55CCd14a1Df5D5546C69bcb8f9B122d2);
        addVoter("vijay shah","09/01/1996","anand shah","dehradun","895629728867",0xa783166B04b4a6ab464657fe9891a9DFe6B31654);
        addVoter("pawan rawat","05/08/1999","ramesh rawat","bageshwar","895629728868",0x1E9BCA52AeCE9236Ce869F6E60E4C3b7473D1DC4);
        addVoter("sagar koranga","15/06/1996","kamal koranga","kausani","895629728869",0x0beB4FD8a62e5C1b09Cb853A45Dbb86cd246eAa5);
        addVoter("Sawan beli","15/08/1996","S Beli","gulbarga","895629728870",0x0beB4FD8a62e5C1b09Cb853A45Dbb86cd246eAa5);

    }

    function addVoter(string memory _name,string memory _dob,string memory _fname,
        string memory _adrs,string memory _uid,address _account) public {
        //voterCount++;
        mydb[_uid] = adhar(_name,_dob,_fname,_adrs,_uid,_account);
        isEnrolled[_uid] = false;
        isEnrolledcd[_uid] = false;

    }

    //voter who voted once
    mapping(string => bool) public  Voter;

    //events
    event votedEvent(
        uint indexed _candidateId
    );

    //vote function
    function vote(string memory _uid,uint _candidateId) public{

        //require voter has not voted before
        require(!Voter[_uid],"");

         // require a valid candidate
        require(_candidateId > 0 && _candidateId <= candidatesCount,"");

        // record that voter has voted
        Voter[_uid] = true;

        // update candidate vote Count
        candidates[_candidateId].voteCount ++;

        //emit the event
        emit votedEvent(_candidateId);

    }
}