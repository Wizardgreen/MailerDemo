const token = document.getElementById('token').value; 
const board = document.querySelector('.board');

// Delet
const btnDel = document.querySelectorAll('.btn-del');
const funcDel = (e) => {
  let id = e.target.dataset.id;
  let xhr = new XMLHttpRequest();
  xhr.open('post','/contact/admin/del');
  xhr.setRequestHeader('Content-type', 'application/json');
  let str = JSON.stringify(
    {
      _csrf: token,
      id: id
    });
  xhr.send(str);
  xhr.onload = () => {
    window.location.replace('/contact/admin');
  };
};

btnDel.forEach((val) => {val.addEventListener('click', funcDel)});

// Show 
const btnShow = document.querySelectorAll('.btn-check');
const funcShow = (e) => {
  let title = document.querySelector('.title');
  let name = document.querySelector('.name');
  let des = document.querySelector('.des');

  title.innerHTML = `標題： ${ e.target.dataset.title }`;
  name.innerHTML = `寄信人： ${ e.target.dataset.name }`;
  des.innerHTML = e.target.dataset.des;

  board.style.zIndex = "2";
  board.style.opacity = "1";
}

btnShow.forEach((val) => {val.addEventListener('click', funcShow)});

// kill show
const btnClose = document.querySelector('.btn-close');
btnClose.addEventListener('click', () => {
  board.style.zIndex = "-2";
  board.style.opacity = "0";
})