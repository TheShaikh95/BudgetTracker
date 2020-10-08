function saveLocally(data) {
    let arr = [];
    let transactions = localStorage.getItem("transactions");
    if (transactions) {
      arr = JSON.parse(transactions);
      arr.push(data);
      localStorage.setItem("transactions", JSON.stringify(arr));
    } else {
      arr.push(data);
      localStorage.setItem("transactions", JSON.stringify(arr));
    }
  }
  
  function extractTransactions() {
    let transactions = localStorage.getItem("transactions");
    let data = [];
    if (transactions) {
      transactions = JSON.parse(transactions);
      transactions.forEach(element => {
        if (!element.backedUp) {
          delete element.backedUp;
          data.push(element);
        }
      });
      return data;
    }
    return [];
  }
  
  function sync(data) {
    const response = callApi("POST", "/api/transaction/bulk", data);
    response.then(result => {
      allBackedUp();
      showOnlineStatus();
    }).catch(err => {
      showOfflineStatus();
    });
  }
  
  
  function allBackedUp() {
    let transactions = localStorage.getItem("transactions");
    let data = [];
    if (transactions) {
      transactions = JSON.parse(transactions);
      transactions.forEach(element => {
        element.backedUp = true;
        data.push(element);
      });
      localStorage.setItem("transactions", JSON.stringify(data));
    }
  }
  
  function callApi(methed, url, data) {
    return new Promise(function(resolve, reject) {
      const xhr = new XMLHttpRequest();
      xhr.open(methed, url);
      xhr.responseType = "json",
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onload = function() {
        resolve({ status: this.status, response: this.response });
      };
      xhr.onerror = function() {
        reject({ status: this.status, response: this.response });
      };
      xhr.send(JSON.stringify(data));
    });
  }
  
  function showOnlineStatus() {
    const offlineAlert = $("#offline-alert");
    const onlineAlert = $("#online-alert");
    if (!offlineAlert.hasClass("d-none")) {
      offlineAlert.addClass("d-none");
    }
    if (onlineAlert.hasClass("d-none")) {
      onlineAlert.removeClass("d-none");
    }
  }
  
  function showOfflineStatus() {
    const offlineAlert = $("#offline-alert");
    const onlineAlert = $("#online-alert");
    if (!onlineAlert.hasClass("d-none")) {
      onlineAlert.addClass("d-none");
    }
    if (offlineAlert.hasClass("d-none")) {
      offlineAlert.removeClass("d-none");
    }
  }
  
  $("document").ready(function() {
    renderTranscationInfo(JSON.parse(localStorage.getItem("transactions")));
    setTotalAmount();
    sync(extractTransactions());
    
    $('#deposit-btn').click(function(ev) {
      ev.preventDefault();
      formDataHandler('deposit');
    });
  
    $('#withdraw-btn').click(function(ev) {
      ev.preventDefault();
      let totalAmount = Number(localStorage.getItem("totalAmount"));
      if (totalAmount < $(`#withdrawAmount`).val()) alert("The amount is not available");
      else formDataHandler('withdraw');
    });
  });
  
  function updateCurrencyValue(propName, amount) {
    let totalAmount = Number(localStorage.getItem("totalAmount"));
    if (propName == 'deposit') totalAmount += Number(amount);
    else if (propName == 'withdraw') totalAmount -= Number(amount);
    localStorage.setItem("totalAmount", `${totalAmount}`);
    document.getElementById("nav-currency-value").innerText = `${totalAmount}`;
  }
  
  
  function formDataHandler(propName) {
    let name = $(`#${propName}Name`).val();
    let amount = $(`#${propName}Amount`).val();
    if (!name || !amount) {
      alert("Input fields cannot be empty");
    } else {
      document.getElementById(`${propName}Form`).reset();
      let data = {
        name,
        amount,
        type: `${propName}`,
        date: new Date(Date.now())
      };
      const response = callApi("POST", "/api/transaction", data);
      response.then(result => {
        data.backedUp = true;
        saveLocally(data);
        showOnlineStatus();
        renderTranscationInfo([data]);
        updateCurrencyValue(propName, amount);
      }).catch(err => {
        data.backedUp = false;
        saveLocally(data);
        showOfflineStatus();
        renderTranscationInfo([data]);
        updateCurrencyValue(propName, amount);
      });
    }
  }
  
  
  function renderTranscationInfo(dataArr) {
    if (!dataArr) return;
    const divEl = $("#transaction-content");
    dataArr.forEach(element => {
      let date = new Date(element.date);
      date = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
      let tag =
      `
      <div class="bg-white shadow mb-5">
        <table class="table text-center">
          <thead class="thead-dark">
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Amount</th>
              <th scope="col">Type</th>
              <th scope="col">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${element.name}</td>
              <td>${element.amount}</td>
              <td>${element.type}</td>
              <td>${date}</td>
            </tr>
          </tbody>
        </table>
      </div>
      `;
      divEl.prepend(tag);
    });
  }
  
  function setTotalAmount() {
    let totalAmount = Number(localStorage.getItem("totalAmount"));
    if (totalAmount) {
      const value = $("#nav-currency-value");
      value.text(totalAmount);
    }
  }