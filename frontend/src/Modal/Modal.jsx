


import React from 'react';
import {Grid, Header, Icon, Form, Message, Segment, Button }  from 'semantic-ui-react';

const Modal = ({error,email,toggleModal, userName, handlerChange,password, toggleLoginRegistration}) => {
    return (
        <Grid textAlign='center' verticalAlign='middle' className='app'>
            <Grid.Column style={{maxWidth: 450}}>
            <Header as='h2' icon color = 'blue' textAlign='center'>
            <Icon name='smile' color = 'blue'/>
            Login to Chat
            </Header>
            <Form size='large' onSubmit = {toggleModal} >
            <Segment>

            
        {/* <Form.Input
            fluid
            name='userName'
            icon='user'
            iconPosition='left'
            placeholder='User name'
            type='text'
            onChange={handlerChange}
            value={userName}
            required
            // className={this.handleInput(this.state.errors, 'email')}
            /> */}
            
        <Form.Input
            fluid
            name='email'
            icon='mail'
            iconPosition='left'
            placeholder='Enter email'
            type='email'
            onChange={handlerChange}
            value={email}
            required
            // className={this.handleInput(this.state.errors, 'email')}
            />

         <Form.Input
           fluid
           name='password'          
            icon='lock'
           iconPosition='left'
            placeholder='Password'
            type='password'            
            onChange={handlerChange}
            value={password}
            required
           //className={this.handleInput(this.state.errors, 'password')}
           /> 

             <Button color='blue' fluid size='large'>Submit</Button>

            </Segment>
            </Form>
            <Message>
                Don't have an acount?
                <Button onClick = {toggleLoginRegistration} color='orange' fluid size='small'>Go to Registration form</Button>
                {/* <NavLink to='/registr'>&nbsp;&nbsp;Registration</NavLink> */}
            </Message>
            {error.length>0 && (
                <Message error>
                <h3>Error</h3>
                <p>{error}</p>
                </Message>
            )
            }
            </Grid.Column>
            </Grid>
        );
    }

export default Modal;
