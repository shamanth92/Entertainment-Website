export default function setLinks(stream) {
    switch (stream) {
        case "Netflix":
            return 'https://www.netflix.com/'
        case "Paramount+":
            return 'https://www.paramountplus.com/home/'
        case "Disney+":
            return 'https://www.disneyplus.com/'
        case "Telemundo":
            return 'https://www.telemundo.com/'
        case "AMC":
            return 'https://www.amcnetworks.com/'

        default:
            break;
    }
}