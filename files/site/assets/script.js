(()=>{var e=document.createElement("b"),e=(e.style.position="fixed",e.style.textAlign="center",e.style.fontSize="14px",e.style.top="0",e.style.left="0",e.style.right="0",e.style.marginTop="44px",e.style.height="21px",e.style.backgroundColor="yellow",e.style.color="black",e.textContent="Due to the Glitch storage limit, we have limited the upload size to 14MB.",document.body.appendChild(e),window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches&&(document.querySelector(".navbar").classList.remove("navbar-dark"),document.querySelector(".navbar").classList.add("navbar-light")),document.querySelector("body"));const t=document.querySelector("#filei");e.addEventListener("dragover",e=>{e.preventDefault()}),e.addEventListener("drop",e=>{e.preventDefault(),1<e.dataTransfer.files.length?alert("Only single file uploads are supported for now."):(console.log(e.dataTransfer.files),1==confirm("Are you sure you want to upload: "+e.dataTransfer.files[0].name)?(t.files=e.dataTransfer.files,document.getElementById("submit_file").click()):alert("The upload was cancelled."))}),document.addEventListener("DOMContentLoaded",function(){document.querySelector("#filei").addEventListener("change",function(){var e=this.value.split("\\").pop();23<e.length&&(e=e.substring(0,23)+"..."),this.nextElementSibling.innerText=e}),document.querySelector("#submit_file").addEventListener("click",function(){document.getElementById("h1upload").textContent="Uploading your file...",document.getElementById("status").classList.add("onclick")})})})();