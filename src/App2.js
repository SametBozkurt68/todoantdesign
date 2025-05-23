import axios from 'axios';
import { useEffect, useState } from 'react';
import "./style2.css";
import { FaCheck, FaTrash , FaPen} from "react-icons/fa";
import { Button, DatePicker, Input, Select, Modal ,notification } from "antd";
import dayjs from "dayjs";

const TodoApp = () => {

    const [todoList, setTodoList] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [editTodo, setEditTodo] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isStart, setIsStart] = useState(null);
    const [isEnd, setIsEnd] = useState('');
    const [isebaslama, setIseBaslama] = useState('');
    const [isibitirme, setIsiBitirme] = useState('');
    const [error, setError] = useState('');
    const [durum, setDurum] = useState(0);
    const [aciklama, setAciklma] = useState("");
    const [filterData, setFilterData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDynamicScreenVisible, setDynamicScreenVisible] = useState(false);
    const [ekleWindow, setEkleWindow] = useState(false);


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
    const toggleDynamicScreen = () => {
        setDynamicScreenVisible(!isDynamicScreenVisible);
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
            notification.error({
                message: "Hata",
                description: "Todo adı boş olamaz.",
            });
            return false;
        }
        if (!isStart || !isEnd) {
            notification.error({
                message: "Hata",
                description: "Lütfen geçerli bir tarih seçin.",
            });
            return false;
        }
        return true;
    };

    const handleCreate = async () => {
        if (!validateInput()) return; // Giriş doğrulama başarısızsa işlemi sonlandır

        try {
            await axios.post("http://localhost:3100/todo-add", {
                todo_adi: newTodo,
                is_verilis: isStart,
                is_bitirme: isEnd,
                durum: durum,
            });

            setNewTodo('');
            setIsStart('');
            setIsEnd('');
            setDurum(0);
            getAll();

            notification.success({
                message: "Başarılı",
                description: "Görev başarıyla eklendi.",
            });
        } catch (error) {
            console.error('Hata oluştu:', error);
            notification.error({
                message: "Hata",
                description: "Görev eklenirken bir hata oluştu.",
            });
        }
    };
    const handleUpdate = async () => {
        if (!validateInput()) return;

        try {
            await axios.post("http://localhost:3100/todo-update", {
                todo_id: editTodo.todo_id,
                todo_adi: newTodo,
                is_verilis: isStart,
                is_bitirme: isEnd,
                durum: durum,
                aciklama: aciklama,
                ise_baslama: isebaslama,
                isi_bitirme: isibitirme,
            });

            setEditTodo(null);
            setNewTodo('');
            setIsStart('');
            setIsEnd('');
            setDurum(0);
            setIseBaslama('');
            setIsiBitirme('');
            setIsEditing(false);
            getAll();

            notification.success({
                message: "Başarılı",
                description: "Görev başarıyla güncellendi.",
            });
        } catch (error) {
            console.error('Hata oluştu:', error);
            notification.error({
                message: "Hata",
                description: "Görev güncellenirken bir hata oluştu.",
            });
        }
    };

    const handleDelete = async (todo_id) => {
        try {
            await axios.post("http://localhost:3100/todo-delete", { todo_id });

            setNewTodo('');
            setIsStart('');
            setIsEnd('');
            setDurum(0);
            getAll();

            notification.success({
                message: "Başarılı",
                description: "Görev başarıyla silindi.",
            });
        } catch (error) {
            console.error('Hata oluştu:', error);
            notification.error({
                message: "Hata",
                description: "Görev silinirken bir hata oluştu.",
            });
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

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
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
        setIsiBitirme(selectedTodo.isi_bitirme);
        setIseBaslama(selectedTodo.ise_baslama);
    };



    return (
        <div className={ekleWindow ? "todo-app-container":""}>

            <div className='todo-app-list'>


                <h1>Liste</h1>

                <div className='baslik'>
                    <Button className={"tarihbtn"} onClick={()=>{
                        setEkleWindow(!ekleWindow)
                    }}>Ekle</Button>  <Input
                        onChange={(e) => Arama(e.target.value)}
                        placeholder='Arama Yap'
                        className='arama'
                    />

                    <Button className='tarihbtn' onClick={sortTodos}>Tarihe Göre Sırala</Button>
                </div>

                <table className='table'>
                    <thead>
                    <tr>
                        <th>Durum İcon</th>
                        <th>Görev Adı</th>
                        <th className='tarihfont'>Görev Başlangıç Tarihi</th>
                        <th className='tarihfont'>Görev Bitiş Tarihi</th>
                        <th className='tarihfont'>Göreve Başlama Tarihi</th>
                        <th className='tarihfont'>Görevi Bitirme Tarihi</th>
                        <th>Durum</th>
                        <th>Acıklama</th>
                        <th>İşlem</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filterData.map((item) => (
                        <tr key={item.todo_id} onClick={() => onClick(item)}
                            className={item.todo_id === editTodo?.todo_id ? "active" : ""}>
                            <td>
                                <FaCheck color={item.durum === 1 ? "blue" : item.durum === 2 ? "green" : "red"}/>
                               
                            </td>
                            <td>{item.todo_adi}</td>
                            <td>{new Date(item.is_verilis).toLocaleDateString()}</td>
                            <td>{new Date(item.is_bitirme).toLocaleDateString()}</td>
                            <td>{new Date(item.ise_baslama).toLocaleDateString()}</td>
                            <td>{new Date(item.isi_bitirme).toLocaleDateString()}</td>
                            <td style={{color: item.durum === 2 ? "green" : item.durum === 1 ? "blue" : "red"}}>
                                {item.durum === 1 ? "Yeni iş" : item.durum === 2 ? "Tamamlanmış iş" : item.durum === 3 ? "Tamamlanmamış iş" : ""}
                            </td>
                            <td>{item.aciklama}</td>
                            <td>
                                <Button onClick={() => handleDelete(item.todo_id)} className='btnsil'>
                                    <FaTrash color={"red"}/>
                                    
                                </Button>

                                <Button onClick={()=> handleCreate(item.to_id)}>
                                    <FaPen/>
                                    </Button>
                            </td>

                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>



            {ekleWindow ? (<div className='todo-app-input'>

                <label>İş Durumu </label>
                <Select
                    value={durum}
                    onChange={(value) => setDurum(value)}
                    className='input'
                    options={[
                        {value: "1", label: "Yeni iş"},
                        {value: "2", label: "Tamamlanan iş"},
                        {value: "3", label: "Tamamlanmamış iş"},
                    ]}
                />

                <label>Görev Ekleme </label>
                <Input
                    size="large"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder='Yeni todo ekle'
                    className='input'
                    maxLength={255}
                />
                <label>Görev Başlangıç Tarihi </label>
                <DatePicker
                    value={isStart ? dayjs(isStart) : null}
                    onChange={(date, dateString) => setIsStart(dateString)}
                    format="YYYY-MM-DD"
                    className="input"
                />
                <label>Görev Bitiş Tarihi </label>
                <DatePicker
                    value={isEnd ? dayjs(isEnd) : ''}
                    onChange={(date, dateString) => setIsEnd(dateString)}
                    format="YYYY-MM-DD"
                    className="input"
                />

                <>
                    <Button type="primary" onClick={showModal}>
                        Open Modal
                    </Button>
                    <Modal
                        title="Basic Modal"
                        open={isModalOpen}
                        onOk={handleOk}
                        onCancel={handleCancel}
                    >

                        {isEditing && (
                            <>

                                <label>İş Durumu </label>
                                <Select
                                    value={durum}
                                    onChange={(value) => setDurum(value)}
                                    className='input'
                                    options={[
                                        {value: "1", label: "Yeni iş"},
                                        {value: "2", label: "Tamamlanan iş"},
                                        {value: "3", label: "Tamamlanmamış iş"},
                                    ]}
                                />

                                <label>Göreve Başlama Tarihi</label>
                                <DatePicker
                                    value={isebaslama ? dayjs(isebaslama) : null}
                                    onChange={(date, dateString) => setIseBaslama(dateString)}
                                    format="YYYY-MM-DD"
                                    className="input"
                                />


                                <label>Görevi Bitirme Tarihi</label>
                                <DatePicker
                                    value={isibitirme ? dayjs(isibitirme) : null}
                                    onChange={(date, dateString) => setIsiBitirme(dateString)}
                                    format="YYYY-MM-DD"
                                    className="input"
                                />

                            </>
                        )}
                        {parseInt(durum, 10) === 3 && (
                            <>
                                <label>Görevi Bitirememe Sebebi</label>
                                <Input
                                    value={aciklama}
                                    onChange={(e) => setAciklma(e.target.value)}
                                    placeholder="Açıklama giriniz"
                                    className="input"
                                />
                            </>
                        )}

                    </Modal>
                </>
                <div className="button">
                    <Button onClick={handleCreate} className="btnekle" disabled={isEditing}>Ekle</Button>
                    <Button onClick={handleUpdate} className="btnguncelle">Güncelle</Button>
                    <Button onClick={() => handleDelete(editTodo?.todo_id)} className="btnsil2">Sil</Button>
                </div>
            </div>):""}
        </div>
    );
};

export default TodoApp;