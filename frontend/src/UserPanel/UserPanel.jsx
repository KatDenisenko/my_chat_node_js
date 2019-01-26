import React from 'react';
import { List,Image, Container,Segment, Icon,Input } from 'semantic-ui-react';
import uuidv4 from 'uuid/v4';
import md5 from 'md5';

const UserPanel = ({allUsers, currentUser, users, onlineUsers,searchUser,handlerChange}) => {
    console.log(onlineUsers)
 let showUsers = allUsers.filter(el=>el.username.toLowerCase().includes(searchUser)?el:null)
 console.log(showUsers)
    return (
        
        
        <div className = 'userPanelContainer'>       
        <Container fluid>
        <Segment>
        <h2>Current user:
        <Image avatar src={`http://gravatar.com/avatar/${md5(`${currentUser}`)}?d=identicon`} />
        {currentUser}</h2>

        <List divided verticalAlign='middle'>
               <h3>Channels</h3> 
                <List.Item >
                <List.Content>
                    <List.Header as='a'>#general</List.Header>                   
                </List.Content>
                </List.Item>

                <List.Item >
                <List.Content>
                    <List.Header as='a'>#another channel</List.Header>                   
                </List.Content>
                </List.Item>
                     
            
         
            </List>
                <h3>Users</h3>
                <Input 
                fluid 
                name='searchUser'
                type='text'
                onChange={handlerChange}
                value={searchUser}
                icon='search' 
                placeholder='Search...' />

                <List divided verticalAlign='middle'>
                {showUsers.map(el=>
                <List.Item key={el.email}>
                <Image avatar src={`http://gravatar.com/avatar/${md5(`${el.username}`)}?d=identicon`} />
                <List.Content>
                    <List.Header as='a'>{el.username}</List.Header>
                    {onlineUsers.includes(el.username)?
                    <Icon name='eye'/>:
                    <Icon name='eye slash'/>
                    }
                </List.Content>
                </List.Item>
                     )}
            
         
            </List>
            </Segment>
  </Container>
  </div>
    );
};

export default UserPanel;