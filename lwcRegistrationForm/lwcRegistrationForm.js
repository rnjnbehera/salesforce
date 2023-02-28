import { LightningElement,wire } from 'lwc';
import createUserRecord from '@salesforce/apex/testObjectController.createUserRecord';
import getTestFirst from '@salesforce/apex/testObjectController.getTestFirst';
import updateUserRecord from '@salesforce/apex/testObjectController.updateUserRecord';
import deleteUserRecord from '@salesforce/apex/testObjectController.deleteUserRecord';
export default class LwcRegistrationForm extends LightningElement {

    enableOtherField = false;
    enableFirstnameField = false;
    lastNameValidationText = false;
    enableCountryField = false;
    enablePhoneField = false;
    enableEmailField = false;
    phoneWithCountryCode='';
    firstNameValidationText='';
    lastNameValidationText='';
    countryValidationText='';
    phoneValidationText='';
    emailValidationText='';
    otherTempValue='';
    recordId = "";
    error = "";
    userInputs = [];
    enableEdit = false;
    @wire(getTestFirst)
    wiredTestFirst({ error, data }){
        if(data){
            this.userInputs = data;
            this.error = '';
        } else if(error){
            this.error = error;
            this.userInputs = [];
        }
    }
 
        
    deleteRecord(event){
        let testObj = { 'sObjectType': 'testFirst__c' };
        testObj.Id = event.target.id.replace('-12',"");
        let text = "Are you sure to do this operation!.";
        if (confirm(text) == true) {

                deleteUserRecord({deleteRecord: testObj})
                    .then(result => {
                    this.recordId=result.Id;           
                    console.log(result);
                    })
                    .catch(error => {
                        console.log(error);
                        this.error = error;
                    });
           }
    }
    
     edit(event){
       this.enableEdit=true;
                
       this.template.querySelector("[data-field='FirstName']").value 
       = this.userInputs.filter(info => info.Id == event.target.id.replace('-12',""))[0].Name.split(" ")[0];
       this.template.querySelector("[data-field='LastName']").value 
       = this.userInputs.filter(info => info.Id == event.target.id.replace('-12',""))[0].Name.split(" ")[1];
        this.template.querySelector("[data-field='Email']").value 
        = this.userInputs.filter(info => info.Id == event.target.id.replace('-12',""))[0].Email__c;
        this.template.querySelector("[data-field='Phone']").value 
        = this.userInputs.filter(info => info.Id == event.target.id.replace('-12',""))[0].Phone__c;        
        this.template.querySelector("[data-field='Country']").value 
            = this.userInputs.filter(info => info.Id == event.target.id.replace('-12',""))[0].Country__c;
        if(this.template.querySelector("[data-field='Edit']") != null)
        {     
            this.template.querySelector("[data-field='Edit']").id = event.target.id.replace('-12',"");   
        }  
    }

    country(event){
        switch(event.target.value){
            case 'USA':
            this.phoneWithCountryCode = '+1'; 
            this.enableOtherField = false;
            break;  
            case 'Bahrain':
            this.phoneWithCountryCode = '+973';  
            this.enableOtherField = false; 
            break;     
            case 'Canada':
            this.phoneWithCountryCode = '+1';  
            this.enableOtherField = false;   
            break;   
            case 'India':
            this.phoneWithCountryCode = '+91';  
            this.enableOtherField = false;
            break;    
            case 'Other':
            this.phoneWithCountryCode = '';      
            this.enableOtherField = true;
            break;
        }
    }

    onSubmit(event){  
        console.log("done");    
        event.preventDefault();  
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if(this.template.querySelector("[data-field='FirstName']").value == '')
        {
            this.firstNameValidationText = "This field is required";    
            this.enableFirstnameField = true;
        } else {
            this.firstNameValidationText = ""; 
            this.enableFirstnameField = false;
        } 
        if( this.template.querySelector("[data-field='LastName']").value == '')
        {
            this.lastNameValidationText = "This field is required";    
            this.enableLastnameField = true;
        } else {
            this.lastNameValidationText = ""; 
            this.enableLastnameField = false;
        } 
        if(this.template.querySelector("[data-field='Country']").value == '')
        {
            this.countryValidationText = "This field is required";    
            this.enableCountryField = true;
        } else {
            this.countryValidationText = ""; 
            this.enableCountryField = false;
        } 
        if( this.template.querySelector("[data-field='Phone']").value == '')
        {
            this.phoneValidationText = "This field is required";    
            this.enablePhoneField = true;
        } else {
            this.phoneValidationText = ""; 
            this.enablePhoneField = false;
        } 
        if( this.template.querySelector("[data-field='Email']").value == '' )
        {
            this.emailValidationText = "This field is required";    
            this.enableEmailField = true;
        }
        else if (reg.test(event.target.value) == false && reg.test(this.template.querySelector("[data-field='Email']").value) == false) 
        {
            this.emailValidationText = "Not a valid email address";    
            this.enableEmailField = true;           
           
        } else {
            this.emailValidationText = ""; 
            this.enableEmailField = false;
        } 
        if(this.template.querySelector("[data-field='Country']").value=='Other')
        {
            if(this.template.querySelector("[data-field='OtherCountry']").value == '')
            {
                this.countryValidationText = "This field is required";    
                this.enableCountryField = true;
            } else {
                this.countryValidationText = ""; 
                this.enableCountryField = false;
            } 
            this.otherTempValue = this.template.querySelector("[data-field='OtherCountry']").value;
        }
        else{
            this.otherTempValue = this.template.querySelector("[data-field='Country']").value;
        }
       if(this.template.querySelector("[data-field='FirstName']").value &&
       this.template.querySelector("[data-field='LastName']").value &&
       this.template.querySelector("[data-field='Email']").value && 
       this.template.querySelector("[data-field='Phone']").value &&
       this.template.querySelector("[data-field='Country']").value
      ){
       var testObj = { 'sObjectType': 'testFirst__c' };
       testObj.Name = this.template.querySelector("[data-field='FirstName']").value+' '+this.template.querySelector("[data-field='LastName']").value;
       testObj.Phone__c = this.phoneWithCountryCode + this.template.querySelector("[data-field='Phone']").value;
       testObj.Email__c = this.template.querySelector("[data-field='Email']").value;
       testObj.Country__c =  this.otherTempValue;
       if(this.template.querySelector("[data-field='Edit']") != null)
       {
         testObj.Id = this.template.querySelector("[data-field='Edit']").id;
         updateUserRecord({updateRecord: testObj})
            .then(result => {
            this.recordId=result.Id;           
            console.log(result);
            })
            .catch(error => {
                console.log(error);
                this.error = error;
            });
       }
       else{
        createUserRecord({newRecord: testObj})
                .then(result => {
                this.recordId=result.Id;                
                console.log(result);
                })
                .catch(error => {
                    console.log(error);
                    this.error = error;
                });

            }
       }

    }
}