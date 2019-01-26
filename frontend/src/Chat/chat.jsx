import React, { Component } from 'react'
import { Container, MessageHeader, Segment, Comment, Input, Button, Header,Icon} from 'semantic-ui-react';
import moment from 'moment';
import socket from "socket.io-client";
// import axios from "axios";
import uuidv4 from 'uuid/v4';
import md5 from 'md5';


window.socket = socket(window.location.origin, {
    path: "/chat/"
},{transports: ['websocket']});

class Chat extends Component {
    state = {
        online:1,
        input: '',
        messages: this.props.messages,
        newMessage:true,
        editMessage:{},
        password:'',
        
    }


    hanlerChange = (e) => {

        this.setState ({
            input: e.target.value,
        })
    }

    recMessage = ()=> {
        let message = {
            time: moment().format('LTS'),
            content: this.state.input,
            author: this.props.userName,
            messId: uuidv4(),
        }
    this.setState (prev => ({
        messages: [...prev.messages, message],
        input:'',
    }))
    window.socket.emit("message", message);
    
    }

    deletMessage =(e)=>{
        const messageId = e.target.id;
        console.log(messageId);
        window.socket.emit("deletMessage", messageId);
        this.setState(prev=>({
            messages: prev.messages.filter(el=>el.messId!==messageId)
        }))
    }
    editMessage =(e)=>{
        let id = e.target.id
        let mes = this.state.messages.find(el=>el.messId===id)
        this.setState({
            input: mes.content,
            newMessage:false,
            editMessage:mes

        })
        console.log(mes)
        console.log(this.state.messages)
    }

    editContent = ()=>{
        
        let editMessage = {...this.state.editMessage, content:this.state.input}
        this.setState(prev=>({
            messages: prev.messages.map(el=>el.messId===editMessage.messId?editMessage:el),
            input:'',
            newMessage:true,
        }))
        window.socket.emit("editMessage", editMessage.messId, editMessage); 
    }

    handleKeyDown =(e)=>{
        if(e.keyCode===13) {
            this.state.newMessage?this.recMessage():this.editContent()
        }
    }
    componentDidMount(){

     
        window.socket.on("change-online", (online) => {
            this.setState({
                online: online
            })
        });
      
        window.socket.on("new-message", (message) => {
            // this.props.getMessage(message);
            this.setState (prev => ({
                messages: [...prev.messages, message],
            }))

        });
        window.socket.on("messageWasDeleted", (messageId) => {
            // this.props.getMessage(message);
            this.setState(prev=>({
                messages: prev.messages.filter(el=>el.messId!==messageId)
            }))

        });
        window.socket.on("message-was-edited", (editMess) => {
            this.setState(prev =>({
                messages: prev.messages.map(el => el.messId === editMess.messId ? editMess : el)
            }))
        });
    }

    componentDidUpdate(prevProps){
        if (this.messagesEnd) {
            this.scrollBottom();
        }
    }

    scrollBottom=()=>{
        this.messagesEnd.scrollIntoView({behavior:"smooth"})
    }

  render() {


    return (
      <div className='container'>
        <Container fluid>

        <MessageHeader/>
           <Segment>

           <Segment clearing>
                <Header 
                fluid='true'
                as='h2'
                floated='left'
                style={{
                    marginBottom: 0
                }}>
                <Header.Subheader>
                    Our Chat / Online:  {this.state.online}
                    
                </Header.Subheader>
                </Header>
            </Segment>

             <Comment.Group className='messages'>
             {this.state.messages.map(el=>
               
                <Comment key = {el.messId}>
                    <Comment.Avatar src={`http://gravatar.com/avatar/${md5(`${el.author}`)}?d=identicon`}/>
                    <Comment.Content>
                        <Comment.Author as='a'>
                            {el.author}
                        </Comment.Author>
                        <Comment.Metadata>
                           {el.time}
                        </Comment.Metadata>

                     <Comment.Text> {el.content}</Comment.Text>
                     {this.props.userName===el.author?
                        <Comment.Actions >
                                    <Comment.Action onClick = {this.deletMessage} id = {el.messId}> <Icon id = {el.messId} name='delete'/>Delete</Comment.Action>
                                    <Comment.Action onClick = {this.editMessage} id = {el.messId} > <Icon id = {el.messId} name='edit'/>Edit</Comment.Action>
                        </Comment.Actions>:null}
                    </Comment.Content>
                </Comment>
            )}
              <div ref = {node=>(this.messagesEnd=node)}/> 
             </Comment.Group>
           </Segment>


           <Segment className='message__form'>
                <Input
                    fluid
                    name='message'
                    style={{
                        marginBottom: '.7rem'
                    }}
                    label={<Button icon='add'/>}
                    labelPosition='left'
                    placeholder='Write your message'
                    onKeyDown={this.handleKeyDown}
                    value = {this.state.input}
                    onChange = {this.hanlerChange}
                   />
                <Button.Group icon widths='2'>
                    <Button color='orange' content='Add Reply' labelPosition='left' icon='edit' onClick={this.state.newMessage?this.recMessage:this.editContent} />
                    {/* <Button color='teal' content='Upload media' labelPosition='right' icon='cloud upload' onClick={this.toggleModal}/> */}
                </Button.Group>
            </Segment>



        </Container>
      </div>
    )
  }
}

export default Chat;