const c_node = document.getElementById("counter");
const inc_b = document.getElementById("inc");
const dec_b = document.getElementById("dec");
const bg_text = document.getElementById("color_input");
const bg_button = document.getElementById("set_bc");

let counter_val = 0;

const render_counter = () => {
    c_node.innerHTML = counter_val;
}


inc_b.addEventListener('click', () => {
    counter_val++;
    render_counter();
});

dec_b.addEventListener('click', () => {
    counter_val--;
    render_counter();
});

bg_button.addEventListener('click', () => {
    const user_color = bg_text.value;
    document.body.style.background = user_color;
});