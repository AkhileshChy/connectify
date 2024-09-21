import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { axiosInstance } from '../lib/axios';

const HomePage = () => {
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });

    const { data: recommendedUsers } = useQuery({
        queryKey: ["recommendedUsers"],
        queryFn: async () => {
            const res = await axiosInstance.get("/users/suggestions");
            return res.data;
        }
    });

    const { data : posts } = useQuery({
        queryKey: ["posts"],
        queryFn: async () => {
            const res = await axiosInstance.get("/posts");
            return res.data;
        }
    });

    return (
        <div>

        </div>
    )
}

export default HomePage
