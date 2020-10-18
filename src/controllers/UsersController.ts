import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import User from '../models/User';
import * as Yup from 'yup';
import Bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';


export default {

    async login(request: Request, response: Response){
        const {
            email,
            password
        } = request.body;
        
        
        const usersRepository = getRepository(User)
        
        const user = await usersRepository.findOneOrFail({
            where: [
              { email: email},
            ]
        })
        const token = JWT.sign({id: user.id}, "secret", {expiresIn: 86400})

        await Bcrypt.compare(password, user.password, function (err, same){
            
            if (same) {
                console.log(token)
                return response.json({
                    user,
                    token: token});
            } else{
                return response.status(400).json({message: "didn't match"});
            }            
        })
        console.log(user)

        
    },
        
    async create(request: Request, response: Response){
        const {
            name,
            email,
            password
        } = request.body;
        
        let passHash = '';

        await Bcrypt.hash(password, 10, function(err, hash) {
            console.log(hash)
            passHash = hash;

            const usersRepository = getRepository(User)

            const data = {
                name: name,
                email: email,
                password: passHash,
            }

            console.log(data, password)

            const schema = Yup.object().shape({
                name: Yup.string().required(),
                email: Yup.string().required(),
                password: Yup.string().required()
            });

            schema.validate(data, {
                abortEarly: false,
            });

            const user = usersRepository.create(data);
        
            usersRepository.save(user)
        
            return response.status(201).json(user);
        })             
    
    },

    async myAccount(request: Request, response: Response ){
        try {
            const { userId } = request;
            
            const usersRepository = getRepository(User)
            
            const user = await usersRepository.findOneOrFail(userId);
            
            console.log(user)
            return response.json({ permission: true });

          } catch (err) {
            return response.status(400).json({ error: "Can't get user information" });
          }
    }

    
};