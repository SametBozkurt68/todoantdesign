import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;







{isEditing === true && ( <> <label>Göreve Başlama Tarihi </label> <DatePicker value={isebaslama ? dayjs(isebaslama) : ''} onChange={(date, dateString) => setIseBaslama(dateString)} format="YYYY-MM-DD" className="input" /> </>)} {isEditing === true && ( <> <label>Görevi Bitirme Tarihi </label> <DatePicker value={isibitirme ? dayjs(isibitirme) : ''} onChange={(date, dateString) => setIsiBitirme(dateString)} format="YYYY-MM-DD" className="input" /> </>)} {parseInt(durum) === 3 ? (<> <label>Görevi Bitirememe Sebebi</label>
  <Input value={aciklama} onChange={(e) => setAciklma(e.target.value)} placeholder='Acıklama giriniz' className={`input`} /> </>) : ""}
