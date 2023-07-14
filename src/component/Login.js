import React, {useState} from "react";
import {Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField} from '@mui/material';
import { SERVER_URL } from "../constant";

export default function Login({setSnackBarOpen, setSnackBarMessage, onLogin}) {
    const [open, setOpen] = useState(false);
    const [loginUser, setLoginUser] = useState({
        id: '',
        password: ''
    });

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleLogin = () => {
        fetch(SERVER_URL + 'login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginUser),
        })
        .then(response => {
            if(response.ok) {
                return response.json();
            } else if(response.status === 401) {
                throw new Error('일치하는 사용자가 없습니다.');
            } else {
                throw new Error(response.status + ' ' + response.statusText);
            }
        })
        .then(data => {
            if(data.id) {
                setOpen(false);
                onLogin(data); // App component의 onLogin 함수 호출
                setSnackBarMessage(`${data.name}님 환영합니다.`);
                setSnackBarOpen(true);
            } else {
                setSnackBarMessage(data);
                setSnackBarOpen(true);
            }
        })
        .catch(err => {
            setSnackBarMessage(err.message);
            setSnackBarOpen(true);
            console.error(err);
        });
    };

    return (
        <>
            <Button color="inherit" onClick={handleOpen}>
                Login
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Login</DialogTitle>
                <DialogContent>
                    <TextField
                        label="ID"
                        value={loginUser.id}
                        onChange={(e) => setLoginUser({...loginUser, id: e.target.value})}
                        fullWidth
                        margin="dense"
                        />
                        <TextField
                        label="Password"
                        value={loginUser.password}
                        onChange={(e) => setLoginUser({...loginUser, password: e.target.value})}
                        type="password"
                        fullWidth
                        margin="dense"
                        />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleLogin}>Login</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}