const token = document.getElementById('token').value; 

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
    console.log('success');
  };
};

btnDel.forEach((val) => {val.addEventListener('click', funcDel)});

