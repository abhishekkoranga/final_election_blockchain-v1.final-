App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,
  cdres: " ",

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Election.json", function(election) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.renderResults();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.Election.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.votedEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
    });
  },

 
  //for voters
  isPresentdb: function() {
    
    var uid = $('#uid').val();
              
    //check uid present in solidity database
    App.contracts.Election.deployed().then(function(instance) {

      instance.isEnrolled(uid).then(function(b){
        if(b)
          return window.alert("already enrolled");
        else {

          instance.mydb(uid).then(function(adhar) {

            var name = adhar[0];
            //check if mapping exist in db
            if(name == "")
             window.alert("adhar data not found"); 
          
            else {  
            //pressent in db
             console.log("existing");
             //writing in database and doing transaction
             return instance.setEnroll(uid, { from: web3.eth.accounts[0] 
            }).then(function(result){

              $('#voterenroll').hide(); 
              //render the details such as name,dob,address.... 
              var dob = adhar[1];
              var adrs = adhar[3];
              var rgstd = $('#registered');
              rgstd.empty();
      
              var rgstdTemplate = "<h3>You are Successfully Enrolled </h3>" + "<p > Name: "+name+"</p>"+"<p > D.O.B: "+dob+"</p>"+"<p > Address: "+adrs+"</p>";
              var x = document.getElementById("registered");
              x.style.backgroundColor = "black";
              x.style.opacity="0.7"
              x.style.width="40%"
              x.style.color="White"
              x.style.padding="4px"
              x.style.fontSize="2rem"
              x.style.marginLeft="auto"
              x.style.marginRight="auto"
              rgstd.append(rgstdTemplate);

            });
            }
          });
        }
             
      });

    });
  },

  //function for candidate

  isPresentdbcd: function() {
   

    var uid = $('#uid').val();
    var party = $('#partylist option:selected').val();//made changes
              
    //check uid present in solidity database
    App.contracts.Election.deployed().then(function(instance) {

      instance.isEnrolledcd(uid).then(function(b){
        if(b)
          return window.alert("already enrolled");
        else {

          //check for party already enrolled for
          instance.isPartyEnrolled(party).then(function(partyEnrolled){
            if(partyEnrolled)
              return window.alert("Candidate with Party : "+party+" already registered");
            else {

              console.log("in else part");
              instance.mydb(uid).then(function(adhar) {

                var name = adhar[0];
                //check if mapping exist in db
                if(name == "")
                 window.alert("adhar data not found"); 
              
                else {  
                //pressent in db
                 console.log("existing");
                 //writing in database and doing transaction
                 return instance.setEnrollcd(uid,party, { from: web3.eth.accounts[0] 
                }).then(function(result){
    
                  $('#candidateenroll').hide();
                  //render the details such as name,dob,address.... 
                  var dob = adhar[1];
                  var adrs = adhar[3];
                  var rgstd = $('#registered');
                  rgstd.empty();
          
                  var rgstdTemplate = "<h2>You have Enrolled Successfully</h2>" + "<p > Name: "+name+"</p>"+"<p > D.O.B: "+dob+"</p>"+"<p > Address: "+adrs+"</p>"+"<p> Party: "+party+"</p>";
                  var x = document.getElementById("registered");
                  x.style.backgroundColor = "black";
                  x.style.opacity="0.7"
                  x.style.width="40%"
                  x.style.color="White"
                  x.style.padding="4px"
                  x.style.fontSize="2rem"
                  x.style.marginLeft="auto"
                  x.style.marginRight="auto"
                  rgstd.append(rgstdTemplate);
    
                }).then(function(party_enrolled){
                  party_enrolled.push(party);
                  console.log(typeof(party_enrolled));
                });
                
        
                }
              });

            }
          });

          
        }
             
      });

    });



  },



  //voting platform handler
  vote : function(){

    //1.verify if already enrolled
    var uid = $('#uid').val();

    App.contracts.Election.deployed().then(function(instance){

      instance.isEnrolled(uid).then(function(b){

        if(!b)
         window.alert("not enrolled");
        else {

          //already voted don't allow to vote
          instance.Voter(uid).then(function(temp){

            if(temp)
              window.alert("voted already!");
            else {

              $('#verification').hide();

              //2.render the details of registered candidates with vote button
              App.contracts.Election.deployed().then(function(instance){
    
                return instance.candidatesCount();
          
              }).then(function(candidatesCount){
          
                var dispCandidates = $('#dispCandidates');
                dispCandidates.empty();
                var candidateList = $('#candidateList');
                candidateList.empty();

                dispCandidates.append("<h3> PLEASE SELECT A CANDIDATE </h3>");
                //dispCandidates.append("<h4><select id='candidateList'></select></h4>");//rendering the select option

                var candidateList=$('#candidateList');
                candidateList.empty();
               
                
                for(var i=1; i<=candidatesCount; i++) {
                  instance.candidates(i).then(function(candidate){
                    //render name and party of candidate
                    var party = candidate[2];
                    var uid = candidate[0];
                    var id = candidate[3];
                  
                    instance.mydb(uid).then(function(adhar){
                      /*var temp= "<p>name: "+adhar[0]+"</p>"+"<p>party: "+party+"</p>";
                      dispCandidates.append(temp);*/
    
                      //render the drop down menu                  
                     // var cdOptions = "<option value='"+id+"' >"+adhar[0]+" ("+party+")</option><p></p>";
                     
                      var cdOptions = "<h4><input type='radio' name='list' style='vertical-align:middle' value='"+id+"' >"+adhar[0]+" ("+party+") <image src='images/"+party+".jpg' height='75px' width='85px' ></h4> <p></p>";
                      
                      dispCandidates.append(cdOptions);
                      // candidateList.append(cdOptions);
                      //  $('#candidateList').ddslick({});
                    });
          
                  });
                 
                }

                
                
                //render vote button
                var castVote = $('#castVote');
                var bt = "<h3><input type='submit' value='vote'></h3>";
                castVote.append(bt);
      
                /*//render the mapped account no
                instance.mydb(uid).then(function(adhar){
                  castVote.append("<p></p> please select account : "+adhar[5]);
                });*/
    
    
              });

            }
          });

        }
         

      });

    });


  },
  votecast:function() {

    var uid = $('#uid').val();
    // var candidateId = $('#candidateList').val();
    var candidateId = $("input[type='radio']:checked").val();
    //do the transaction
    App.contracts.Election.deployed().then(function(instance){
      return instance.vote(uid,candidateId,{from:web3.eth.accounts[0]});
    }).then(function(result){

      //hide the current form 
      $('#castVote').hide();

      //display the candidate casted vote      
      App.contracts.Election.deployed().then(function(instance){
          instance.candidates(candidateId).then(function(candidate){
          instance.mydb(candidate[0]).then(function(adhar){
            //alert("voted for name:"+adhar[0]+" party:"+candidate[2]);
            var ack = $("#ack");
            var temp = "<h3>VOTE ACKNOWLEGEMENT</h3>"+"<p>Candidate : "+adhar[0]+"</p>"+"<p>Party : "+candidate[2]+" <image src='images/"+candidate[2]+".jpg' height='55px' width='55px'> </p>";
            var x = document.getElementById("ack");
            x.style.backgroundColor = "black";
            x.style.opacity="0.7"
            x.style.width="40%"
            x.style.color="White"
            x.style.padding="4px"
            x.style.fontSize="2rem"
            x.style.marginLeft="auto"
            x.style.marginRight="auto"
            ack.append(temp);
        });
          
          
        });

      });
            
    });  
    
  },

  //render the results after voting
  renderResults:function(){
    var electionInstance;
    
    App.contracts.Election.deployed().then(function(instance){
    
      electionInstance=instance;
      return instance.candidatesCount();
    }).then(function(candidatesCount){
      var candidatesResults = $('#tp');
      candidatesResults.empty();

      for(var i=1;i<=candidatesCount;i++)
      {
        electionInstance.candidates(i).then(function(candidate){
          var party = candidate[2];
          var uid = candidate[0];
          var id = candidate[3];
          var votes = candidate[1];

          electionInstance.mydb(uid).then(function(adhar){
            var template = "<tr><th>" + id + "</th><td>" + adhar[0] + "</td><td>" + party + "   <image src='images/"+party+".jpg' height='55px' width='55px'></td><td>"+votes+"</td></tr>";
            candidatesResults.append(template);
          });
          

        });
      }
    });
  }




};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
