import axios from 'axios';
import { useEffect, useState } from 'react';
import "./style.css";
import { FaCheck, FaTrash } from "react-icons/fa";
import { Button, DatePicker, Input, Select } from "antd";
import dayjs from "dayjs";

const TodoApp = () => {

    const [todoList, setTodoList] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [editTodo, setEditTodo] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isStart, setIsStart] = useState(null);
    const [isEnd, setIsEnd] = useState('');
    const [error, setError] = useState('');
    const [durum, setDurum] = useState(0); 
    const [aciklama, setAciklma] = useState("");
    const [filterData, setFilterData] = useState([]);
    
 //test commit1
    const getAll = () => {
        axios.get("http://localhost:3100/todo-find-all")
            .then(response => {
                setTodoList(response.data);
                setFilterData(response.data);
            })
            .catch(error => {
                console.error('Hata oluştu:', error);
            });
    };

    const getDurum = () => {
        axios.get("http://localhost:3100/durum")    
            .then(response => setDurum(response.data))
            .catch(error => console.error('Kategori verisi alınamadı:', error));
    };

    useEffect(() => {
        getAll();
        getDurum();
    }, []);

    const validateInput = () => {
        if (!newTodo.trim()) {
            setError(window.confirm("Todo adı boş olamaz."));
            return false;
        }
        if (!isStart || !isEnd) {
            setError(window.confirm("Lütfen geçerli bir tarih seçin."));
            return false;
        }
        setError('');
        return true;
    };

    const handleCreate = async () => {
        if (validateInput(), window.confirm("Görev Eklendi")) {
            try {
                await axios.post("http://localhost:3100/todo-add", { todo_adi: newTodo, is_verilis: isStart, is_bitirme:isEnd, durum: durum });
                setNewTodo('');
                setIsStart(''); 
                setIsEnd('');
                setDurum(0);
                getAll();
                //ŞUAN eklemesi lazım ekleme değil la silme işlemi ne yapınca input icerikleri silinmiyo
            } catch (error) {
                console.error('Hata oluştu:', error);
            }
        }
    };

    const handleUpdate = async () => {
        if (validateInput(), window.confirm("Görev Güncellendi")) {
            try {
                await axios.post("http://localhost:3100/todo-update", { todo_id: editTodo.todo_id, todo_adi: newTodo, is_verilis: isStart, is_bitirme:isEnd, durum: durum, aciklama: aciklama });
                setEditTodo(null);
                setNewTodo('');
                setIsStart('');
                setIsEnd('');
                setDurum(0);
                getAll();
                setIsEditing(false);
                
            } catch (error) {
                    console.error('Hata oluştu:', error);
                }
        }
    };

    const handleDelete = async (todo_id) => {
        if (window.confirm("Bu görevi silmek istediğinize emin misiniz?")) {
            try {
                await axios.post("http://localhost:3100/todo-delete", { todo_id });
                setNewTodo('');
                setIsStart(''); 
                setIsEnd('');
                setDurum(0);
                getAll(); //düzelir
            } catch (error) {
                console.error('Hata oluştu:', error);
            }
        }
    };

    const sortTodos = () => {
        const sortedTodos = [...todoList].sort((a, b) => new Date(b.is_verilis) - new Date(a.is_verilis));
        setFilterData(sortedTodos);
    };

    const Arama = (query) => {
        const bulunanveri = todoList.filter(item => item.todo_adi.toLowerCase().includes(query.toLowerCase()));
        setFilterData(bulunanveri);
    };

    const onClick = (selectedTodo) => {
     
        console.log(selectedTodo)
        setEditTodo(selectedTodo);
        setNewTodo(selectedTodo.todo_adi);
        setIsEditing(true);
        setIsStart(selectedTodo.is_verilis);
        setIsEnd(selectedTodo.is_bitirme);
        setDurum(selectedTodo.durum);
        setAciklma(selectedTodo.aciklama);
     
    };
   


    return (
        <div className='todo-app-container'>

            <div className='todo-app-list'>
                <h1>Liste</h1>
                <div className='baslik'> 
                    <Input
                        onChange={(e) => Arama(e.target.value)}
                        placeholder='Arama Yap'
                        className='arama'
                    />
                    <Button className='tarihbtn' onClick={sortTodos}>Tarihe Göre Sırala</Button>
                </div>

                <table className='table'>
                    <thead>
                        <tr>
                            <th>Durum İcon </th> 
                            <th>Görev Adı </th>  
                            <th className='tarihfont'>Görev Başlangıç Tarihi</th>
                            <th className='tarihfont'>Görev Bitiş Tarihi</th>
                            <th >Durum </th>
                            <th>Acıklama</th>
                            <th>İşlem </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filterData.map((item) => (
                            <tr key={item.todo_id} onClick={() => onClick(item)} className={item.todo_id === editTodo?.todo_id ? "active" : ""}>
                                <td>        
                                    <FaCheck color={item.durum === 1 ? "blue" : item.durum === 2 ? "green" : "red"} /> 
                                </td>
                                <td>{item.todo_adi}</td>
                                <td>{new Date(item.is_verilis).toLocaleDateString()}</td>
                                <td>{new Date(item.is_bitirme).toLocaleDateString()}</td>
                                <td style={{ color: item.durum === 2 ? "green" : item.durum === 1 ? "blue" : "red" }}>
                                    {item.durum === 1 ? "Yeni iş" : item.durum === 2 ? "Tamamlanmış iş" : item.durum === 3 ? "Tamamlanmamış iş" : ""}
                                </td>
                                <td>{item.aciklama}</td>
                                <td>
                                    <button onClick={() => handleDelete(item.todo_id)} className='btnsil'>
                                        <FaTrash color={"red"} />
                                    </button> 
                                </td>
                            </tr> 
                        ))}
                    </tbody>
                </table>
            </div>

            <div className='todo-app-input'>
                <label>İş Durumu    </label>
                <Select
                    value={durum}   
                    onChange={(value) => setDurum(value)}    
                    className='input'
                    options={[
                        { value: "1", label: "Yeni iş" },
                        { value: "2", label: "Tamamlanan iş" },
                        { value: "3", label: "Tamamlanmamış iş" },
                    ]}
                />

                <label>Görev Ekleme    </label>
                <Input
                    size="large"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder='Yeni todo ekle'
                    className='input' 
                    maxLength={255}
                /> 
                <label>Görev Başlangıç Tarihi    </label>
                <DatePicker
                    value={isStart ? dayjs(isStart) : null} 
                    onChange={(date, dateString) => setIsStart(dateString)}    
                    format="YYYY-MM-DD" 
                    className="input"
                 />
                <label>Görev Bitiş Tarihi    </label>
                <DatePicker
                    value={isEnd ? dayjs(isEnd) : ''} 
                    onChange={(date, dateString) => setIsEnd(dateString)}    
                    format="YYYY-MM-DD" 
                    className="input"
                 />


                {parseInt(durum) === 3 ? (
                    <input
                        value={aciklama}
                        onChange={(e) => setAciklma(e.target.value)}
                        placeholder='Acıklama giriniz'
                        className={`input`}
                    />
                ) : ""}

                <div className="button">
                    <Button onClick={handleCreate} className="btnekle" disabled={isEditing}>Ekle</Button>
                    <Button onClick={handleUpdate} className="btnguncelle">Güncelle</Button>
                    <Button onClick={() => handleDelete(editTodo?.todo_id)} className="btnsil2">Sil</Button>
                </div>
            </div>
        </div>
    );
};

export default TodoApp;
