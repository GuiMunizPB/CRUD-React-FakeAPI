import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Gastos = () => {
  const [gastos, setGastos] = useState([]);
  const [newGasto, setNewGasto] = useState({
    orgao: '',
    data: '',
    valor: '',
  });
  const [selectedGasto, setSelectedGasto] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/gastos')
      .then(response => response.json())
      .then(data => setGastos(data));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGasto((prevGasto) => ({
      ...prevGasto,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (selectedGasto) {
      // Atualização
      fetch(`http://localhost:3000/gastos/${selectedGasto.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGasto),
      })
        .then(response => response.json())
        .then(updatedGasto => {
          setGastos(prevGastos =>
            prevGastos.map(gasto =>
              gasto.id === selectedGasto.id ? updatedGasto : gasto
            )
          );
          setNewGasto({
            orgao: '',
            data: '',
            valor: '',
          });
          setSelectedGasto(null);
          setShowModal(false);
        })
        .catch(error => console.error('Erro ao atualizar o gasto:', error));
    } else {
      // Inserção (manteve o código original para adição de gasto)
      fetch('http://localhost:3000/gastos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGasto),
      })
        .then(response => response.json())
        .then(data => {
          setGastos(prevGastos => [...prevGastos, data]);
          setNewGasto({
            orgao: '',
            data: '',
            valor: '',
          });
          setShowModal(false);
        })
        .catch(error => console.error('Erro ao adicionar o gasto:', error));
    }
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:3000/gastos/${id}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(() => {
        setGastos(prevGastos => prevGastos.filter(gasto => gasto.id !== id));
      })
      .catch(error => console.error('Erro ao excluir o gasto:', error));
  };

  const handleUpdate = (gasto) => {
    setSelectedGasto(gasto);
    setNewGasto({
      orgao: gasto.orgao,
      data: gasto.data,
      valor: gasto.valor,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewGasto({
      orgao: '',
      data: '',
      valor: '',
    });
    setSelectedGasto(null);
  };

  return (
    <div>
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Adicionar Gasto
      </Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedGasto ? 'Atualizar Gasto' : 'Adicionar Gasto'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formOrgao">
              <Form.Label>Órgão Responsável</Form.Label>
              <Form.Control
                type="text"
                placeholder="Inserir nome do órgão"
                name="orgao"
                value={newGasto.orgao}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formData">
              <Form.Label>Data de Assinatura</Form.Label>
              <Form.Control
                type="text"
                placeholder="Inserir a data"
                name="data"
                value={newGasto.data}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formValor">
              <Form.Label>Valor Gasto</Form.Label>
              <Form.Control
                type="text"
                placeholder="Inserir valor"
                name="valor"
                value={newGasto.valor}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fechar
          </Button>
          <Button variant="primary" onClick={handleFormSubmit}>
            {selectedGasto ? 'Atualizar Gasto' : 'Adicionar Gasto'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Table bordered hover>
        <thead>
          <tr>
            <th>Órgão Responsável</th>
            <th>Data de Assinatura</th>
            <th>Valor Gasto</th>
            <th>Opções</th>
          </tr>
        </thead>
        <tbody>
          {gastos.map((gasto) => (
            <tr key={gasto.id}>
              <td>{gasto.orgao}</td>
              <td>{gasto.data}</td>
              <td>R${gasto.valor}</td>
              <td>
                <Button variant="primary" onClick={() => handleUpdate(gasto)}>
                  Atualizar
                </Button>
                <Button variant="danger" onClick={() => handleDelete(gasto.id)}>
                  Excluir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Gastos;
