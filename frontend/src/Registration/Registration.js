import React from 'react';
import { Grid, Header, Icon, Form, Message, Segment, Button } from 'semantic-ui-react';

const Registration = ({error,email, registrationSubmit, userName, handlerChange,password, passwordConfirm, toggleLoginRegistration}) => {
    return (
        <Grid textAlign='center' verticalAlign='middle' className='app'>
            <Grid.Column style={{maxWidth: 450}}>
            <Header as='h2' icon color = 'blue' textAlign='center'>
            <Icon name='comment alternate' color = 'blue'/>
            Register to Chat
            </Header>
            <Form size='large' onSubmit={registrationSubmit}>
            <Segment>

            <Form.Input
            fluid
            name='userName'
            icon='user'
            iconPosition='left'
            placeholder='Username'
            type='text'
            onChange={handlerChange}
            value={userName}
            required
            // autoFocus
           // className={this.handleInput(this.state.errors, 'username')}
            />
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

<Form.Input
            fluid
            name='passwordConfirm'
            icon='repeat'
            iconPosition='left'
            placeholder='Password Confirm'
            type='password'
            onChange={handlerChange}
            value={passwordConfirm}
            required
            //className={this.handleInput(this.state.errors, 'password')}
            />

            <Button color='blue' fluid size='large'>Submit</Button>

            </Segment>
            </Form>
            {/* {this.state.errors.length>0 && (
                <Message error>
                <h3>Error</h3>
                {this.state.errors.map(el => <p key={el.message}>{el.message}</p>)}
                </Message>
            )
            } */}
            <Message>
                Already a user?
                <Button color='orange' fluid size='small' onClick = {toggleLoginRegistration}>Go to Log in form</Button>
                {/* <NavLink to='/login'>&nbsp;&nbsp;Login</NavLink> */}
            </Message>
            {error.length>0 && (
                <Message error>
                <h3>Error</h3>
                <p>{error}</p>
                </Message>
            )}

            </Grid.Column>
            </Grid>
    );
};

export default Registration;
