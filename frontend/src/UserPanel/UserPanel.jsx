import React from 'react';
import { List,Image, Container,Segment, Icon } from 'semantic-ui-react';
import uuidv4 from 'uuid/v4';
const UserPanel = ({allUsers, currentUser, users, onlineUsers}) => {
    console.log(onlineUsers)

    return (
        
        
        <div className = 'userPanelContainer'>       
        <Container fluid>
        <Segment>

        <h2>Current user: {currentUser}</h2>
        <List divided verticalAlign='middle'>
               <h3>Channels</h3> 
                <List.Item >
                <List.Content>
                    <List.Header as='a'>#general</List.Header>                   
                </List.Content>
                </List.Item>

                <List.Item >
                <List.Content divided verticalAlign='end'>
                    <List.Header as='a'>#another channel</List.Header>                   
                </List.Content>
                </List.Item>
                     
            
         
            </List>
                <h3>Users</h3>
                <List divided verticalAlign='middle'>
                {allUsers.map(el=>
                <List.Item key={el.email}>
                <Image avatar src='/images/avatar/small/daniel.jpg' />
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