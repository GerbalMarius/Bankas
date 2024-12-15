import React from 'react';
import {BACKEND_PREFIX} from "./App";
import axios from "axios";

export const fetchUserRoles = async () => {

    try {
        const response = await axios.get<string[]>(BACKEND_PREFIX + "/api/user/currentRoles",
            {withCredentials: true},
            );
        return response.data
    }catch (err){
        return null;
    }
}