const COLORS = {
    temperature: [
        { min: -100, max: -25, color: "#9f80ff" },
        { min: -25, max: -20, color: "#784cff" },
        { min: -20, max: -15, color: "#0f5abe" },
        { min: -15, max: -10, color: "#1380ff" },
        { min: -10, max: -5, color: "#19cdff" },
        { min: -5, max: 0, color: "#8fffff" },
        { min: 0, max: 5, color: "#b0ffbc" },
        { min: 5, max: 10, color: "#ffff73" },
        { min: 10, max: 15, color: "#ffbe7d" },
        { min: 15, max: 20, color: "#ff9b41" },
        { min: 20, max: 25, color: "#ff5a41" },
        { min: 25, max: 30, color: "#ff1e23" },
        { min: 30, max: 100, color: "#fa3c96" },

    ],
    snowheight:[
        { min:0, max:1, color: "#fff" },
        { min:1, max:10, color: "#ffffb2" },
        { min:10, max:25, color: "#b0ffbc" },
        { min:25, max:50, color: "#8cffff" },
        { min:50, max:100, color: "#19cdff" },
        { min:100, max:200, color: "#1982ff" },
        { min:200, max:300, color: "#0f5abe" },
        { min:300, max:400, color: "#784bff" },
        { min:400, max:1000, color: "#cd0feb" },
    ],

    wind: [
        {min: 0, max: 5, color: "#ffff64"},
        {min: 5, max: 10, color: "#c8ff64;"},
        {min: 10, max: 20, color: "#96ff96;"},
        {min: 20, max: 40, color: "#32c8ff"},
        {min: 40, max: 60, color: "#6496ff"},
        {min: 60, max: 80, color: "#9664ff"},
        {min: 80, max: 200, color: "#ff3232"},
    ],
}


// this funciton was written by copilot but other one is more elegant
function getColor2(value) {
    let color
    for (let i = 0; i < COLORS.temperature.length; i++) {
        if (value >= COLORS.temperature[i].min && value < COLORS.temperature[i].max) {
            color = COLORS.temperature[i].color;
            break;
        }
    }
    return color;
}





//console.log(getColor(0, COLORS.temperature));