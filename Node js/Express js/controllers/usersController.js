import { userList } from "../models/usersModel.js"

export const handleUsers = ((req, res)=>{
    const userData = userList();
    res.render('users', {users: userData})
})