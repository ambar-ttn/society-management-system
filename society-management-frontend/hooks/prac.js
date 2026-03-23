import {useState,useEffect} from "react";



export default function useAuth(){

    const[user,setUser]=useState(null);
    const[token,setToken]=useState(null);
    const[loading,setLoading]=useState(null);


    function login(userDetails,token){
        setToken(token);
        setUser(JSON.parse(userDetails));

        localStorage.setItem('token',token);
        localStorage.setItem('user',user);

    }


    function logout(){
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
return {login , logout , user , loading , token};

}

//frontend authentication manager hai.