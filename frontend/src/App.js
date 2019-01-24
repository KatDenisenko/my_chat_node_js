import React, { Component } from 'react';
import socket from "socket.io-client";
import './App.css';
import Chat from './Chat/chat'
import Modal from './Modal/Modal'
import 'semantic-ui-css/semantic.min.css'
import UserPanel from './UserPanel/UserPanel'
import Registration from './Registration/Registration';

window.socket = socket(window.location.origin, {
  path: "/chat/"
},{transports: ['websocket']});



class App extends Component {

  state = {
    modal:true,
    modalRegistration:false,
    currentUser:{},
    userName:'Tina',
    password:'',
    passwordConfirm:'',
    email:'',
    messages:[],
    users:[],
    allUsers:[],
    loader:true,
    onlineUsers: [],
    error:''
  }

  // uniqueNames=(arr)=> {
  //   let  obj = {};
  //     for (let i = 0; i < arr.length; i++) {
  //     let str = arr[i].author;
  //     obj[str] = true; // запомнить строку в виде свойства объекта
  //   }
  //   let result = [...Object.keys(obj)];

  //    return result;
  // }
  
  registrationSubmit =()=>{
    let obj={
      username: this.state.userName,
      password:this.state.password,
      email:this.state.email,
    }

    window.socket.emit('register', obj)
    
    // this.setState(prev=>({
    //   modalRegistration:!prev.modalRegistration,
    //   users:[ this.state.userName, ...prev.users],
    //   onlineUsers:[this.state.userName,...prev.onlineUsers]
    // }))
    // this.userOnlineFunc(this.state.userName)
    // console.log(obj);
  }

  toggleModal = () => {
    let obj={
      //username: this.state.userName,
      password:this.state.password,
      email:this.state.email,
    }
    window.socket.emit('login',obj)
  }

 // }


toggleLoginRegistration = () => {
  this.setState(prev=>({
    modal:!prev.modal,
    modalRegistration: !prev.modalRegistration,
    userName:'',
    password:'',
    passwordConfirm:'',
    error:''
  }))
}

 userOnlineFunc = (userName)=> {
  window.socket.emit("user-online", (userName));
 }

  handlerChange=(e)=> {
    let key = e.target.name;
    let value = e.target.value;
    this.setState({
        [key]:value,
       
    })}

    componentWillMount(){

      window.socket.emit('new-user')

      window.socket.on("All-message", (docs) => {
         console.log(docs)
        let arr = [...docs]
        this.setState ({
            messages: arr,
            //users: this.uniqueNames(arr),
            loader: false,
        })
        
        console.log(docs)
    });
    window.socket.on("All-users", (users) => {
      console.log(users);
        this.setState({
          allUsers:users
        })
    })
    // let user = {
    //   data: 'succsess',
    // }
   

    // console.log('aaaaaaaaaaaaaa1')
   
    }

    // componentDidUpdate(){
    //   window.socket.on("userAddedOnline", (userName) => {
    //     console.log(userName)
    //     this.setState(prev=>({
    //       onlineUsers: [...prev.onlineUsers, userName]
    //     }))
        
    // });
    // }

    componentDidMount(){
      window.socket.on('register-on-DB', (message) => {
        if (!message.currentUser) {
          this.setState(
            {error:message.message})
        } else {
        this.setState(prev=>({
          currentUser:message.currentUser,
          userName: message.currentUser.username,
          modalRegistration:false,
          users:[ message.currentUser.username, ...prev.users],
          onlineUsers:[message.currentUser.username,...prev.onlineUsers]
        }))
        this.userOnlineFunc(message.currentUser.username)

      }
        console.log('register-on-DB', message);
      });

      window.socket.on("userAddedOnline", (userName) => {
        console.log(userName)

        this.setState(prev=>({
          onlineUsers: [...prev.onlineUsers, userName]
        }))
        
    });
  

      window.socket.on('login-done', (message) => {
        if (!message.currentUser) {
          this.setState(
            {error:message.message})
        } else {
        this.setState(prev=>({
          error:'',
          currentUser:message.currentUser,
          userName: message.currentUser.username,
          modal: false,
          onlineUsers:[message.currentUser.username,...prev.onlineUsers],
        }))
        this.userOnlineFunc(message.currentUser.username)
      }
        console.log(message);
      });
      
    }

    

    // componentWillUnmount(){
    //   window.socket.emit('disconnect')
    // }



  render() {
   // console.log(this.uniqueNames(this.state.messages));
    console.log(this.state.onlineUsers)//this.uniqueNames(this.state.messages)
    return (
      <div className="App">
      {this.state.modal && !this.state.modalRegistration?
       <Modal error = {this.state.error} email = {this.state.email} toggleLoginRegistration={this.toggleLoginRegistration} handlerChange = {this.handlerChange} userName = {this.state.userName} password = {this.state.password} toggleModal = {this.toggleModal}/>
       : !this.state.modal && this.state.modalRegistration?
       <Registration  error = {this.state.error} email = {this.state.email} toggleLoginRegistration={this.toggleLoginRegistration} passwordConfirm = {this.state.passwordConfirm}handlerChange = {this.handlerChange} userName = {this.state.userName} password = {this.state.password} registrationSubmit = {this.registrationSubmit}/>
      : <div> 
        {/* <UserPanel users = {this.state.users}/> */}
        {this.state.loader?<p>Loading....</p>:
        <div className = 'chartWrapper'>
        <UserPanel allUsers = {this.state.allUsers} currentUser = {this.state.userName} users = {this.state.users} onlineUsers = {this.state.onlineUsers}/>
        <Chat messages = {this.state.messages} userName = {this.state.userName}/>
        </div>}
        </div>}
      </div>
    );
  }
}

export default App;
