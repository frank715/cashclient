import requests from "./httpService";

export const userServices = {
    getUsersList: () =>  requests.get(`/users/users?timestamp=${new Date().getTime()}`),

    getGamesList: () => requests.get(`/users/games?timestamp=${new Date().getTime()}`),

    bulkGameUpdate: (body) => requests.post(`/users/bulkupdategame?timestamp=${new Date().getTime()}`, body),

    viewGameUpdate: (body) => requests.post(`/users/updategame?timestamp=${new Date().getTime()}`, body)
}