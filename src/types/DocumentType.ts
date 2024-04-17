export type DocumentCreation = {
    title: string,
    description: string,
    path: string,
    mimetype: string
}

export type DocumentUpdate = {
    id: number,
    title: string,
    description: string
}