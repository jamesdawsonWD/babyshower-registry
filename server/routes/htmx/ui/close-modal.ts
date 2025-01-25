export default defineEventHandler(async (event) => {
    return `<div
      id="modalContainer"
      class="w-screen h-screen fixed z-[9999] bg-black/50 top-0 left-0 flex items-center justify-center empty:hidden"
    ></div>`;
});
