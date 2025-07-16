export const formatTime = (date) => {
    const time = new Date(date).toLocaleTimeString("en-US",{
        hour:"2-digit",
        minute:"2-digit",
        hour12:true
    })

    return time
}