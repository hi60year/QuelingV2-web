export interface PlayerPayload {
    name: string,
    tziakchaName: string,
    qqNum: string,
    isCurrentStudent: boolean
}

export function newPlayer(): PlayerPayload {return ({
    name: "",
    tziakchaName: "",
    qqNum: "",
    isCurrentStudent: true
})}
