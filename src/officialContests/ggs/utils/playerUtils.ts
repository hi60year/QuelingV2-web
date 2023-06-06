export interface PlayerPayload {
    name: string,
    tziakchaName: string,
    qqNum: string,
    isCurrentStudent: boolean,
    college: string
}

export function newPlayer(): PlayerPayload {return ({
    name: "",
    tziakchaName: "",
    qqNum: "",
    isCurrentStudent: true,
    college: "",
})}
