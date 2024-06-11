const c_node = document.getElementById("counter");
const inc_b = document.getElementById("inc");
const dec_b = document.getElementById("dec");

let counter_val = 0;

const render_counter = () => {
    c_node.innerHTML = counter_val;
}


inc_b.addEventListener('click', () => {
    counter_val++;
    render_counter();
})

dec_b.addEventListener('click', () => {
    counter_val--;
    render_counter();
})

