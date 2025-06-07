import express from "express";
import {CredentialsProvider} from "../providers/CredentialsProvider";
import jwt from "jsonwebtoken";
import {generateAuthToken} from "../tokenAuth";





export function registerAuthRoutes(app: express.Application, userProvider: CredentialsProvider){
    app.post("/auth/register", (req, res) => {
        if(!req.body.username || !req.body.password){
            res.status(400).send("Username and password are required");
            return
        }

        userProvider.getAllUsers().then((users) => {
            if(users.find(user => user.username === req.body.username)){
                res.status(409).send("User already exists").end()
                return;
            }
            return userProvider.registerUser(req.body.username, req.body.password)
        }).then((user) => {
            if (user == undefined){
                return
            }
            if(user){
                generateAuthToken(req.body.username).then((token) => {
                    res.status(201).json({token});
                })
            } else {
                res.status(500).send("Could not register user");
            }
        }).catch((err) => {
            res.status(500).send(err);
        })
    })

    app.post("/auth/login", (req, res) => {
        if(!req.body.username || !req.body.password){
            res.status(400).send("Username and password are required");
            return;
        }
        userProvider.verifyPassword(req.body.username, req.body.password).then((valid) => {
            if(valid){
                generateAuthToken(req.body.username).then((token) => {
                    res.status(201).json({token});
                })
                return;
            }
            res.status(401).send("Unauthorized");
        })
    })
}