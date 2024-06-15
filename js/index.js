const c_node = document.getElementById("counter");
const inc_b = document.getElementById("inc");
const dec_b = document.getElementById("dec");
const bg_text = document.getElementById("color_input");
const bg_button = document.getElementById("set_bc");

let counter_val = 0;

const renderCounter = () => {
    c_node.innerHTML = counter_val;
}

const setBGColor = () => {
    const user_color = bg_text.value;
    document.body.style.background = user_color;
}


inc_b.addEventListener('mousedown', () => {
    counter_val++;
    renderCounter();
});

dec_b.addEventListener('mousedown', () => {
    counter_val--;
    renderCounter();
});

bg_button.addEventListener('click', () => {
    setBGColor();
});

addEventListener('keydown', (event) => {
    if (event.key === "Enter") {
        setBGColor();
    }
})