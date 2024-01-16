import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Acoes.css';

const Acoes = () => {
  const [acoes, setAcoes] = useState([]);
  const [newAcao, setNewAcao] = useState({
    orgao: '',
    dataInicio: '',
    previsao: '',
    titulo: '',
    descricao: '',
    tematica: '',
    valor: '',
    municipio: '',
    administracao: [
      {
        nome: '',
        partido: '',
      },
    ],
  });
  const [selectedAcao, setSelectedAcao] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/acoes')
      .then(response => response.json())
      .then(data => setAcoes(data));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAcao((prevAcao) => ({
      ...prevAcao,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (selectedAcao) {
      // Atualização
      fetch(`http://localhost:3001/acoes/${selectedAcao.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAcao),
      })
        .then(response => response.json())
        .then(updatedAcao => {
          setAcoes(prevAcoes =>
            prevAcoes.map(acao =>
              acao.id === selectedAcao.id ? updatedAcao : acao
            )
          );
          setNewAcao({
            orgao: '',
            dataInicio: '',
            previsao: '',
            titulo: '',
            descricao: '',
            tematica: '',
            valor: '',
            municipio: '',
            administracao: [
              {
                nome: '',
                partido: '',
              },
            ],
          });
          setSelectedAcao(null);
          setShowModal(false);
        })
        .catch(error => console.error('Erro ao atualizar a ação:', error));
    } else {
      // Inserção
      // Obter o último ID e incrementar
      const lastId = acoes.length > 0 ? parseInt(acoes[acoes.length - 1].id, 10) : 0;
      const newId = lastId + 1;

      // Adicionar a nova ação com o ID incrementado
      fetch('http://localhost:3001/acoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newAcao, id: newId.toString() }), // Converter o novo ID para string
      })
        .then(response => response.json())
        .then(data => {
          setAcoes(prevAcoes => [...prevAcoes, data]);
          setNewAcao({
            orgao: '',
            dataInicio: '',
            previsao: '',
            titulo: '',
            descricao: '',
            tematica: '',
            valor: '',
            municipio: '',
            administracao: [
              {
                nome: '',
                partido: '',
              },
            ],
          });
          setShowModal(false);
        })
        .catch(error => console.error('Erro ao adicionar a ação:', error));
    }
  };

  const handleInputChangeAdmin = (e, field) => {
    const { value } = e.target;
    setNewAcao((prevAcao) => ({
      ...prevAcao,
      administracao: [
        {
          ...prevAcao.administracao[0],
          [field]: value,
        },
      ],
    }));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:3001/acoes/${id}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(() => {
        setAcoes(prevAcoes => prevAcoes.filter(acao => acao.id !== id));
      })
      .catch(error => console.error('Erro ao excluir a ação:', error));
  };

  const handleUpdate = (acao) => {
    setSelectedAcao(acao);
    setNewAcao({
      orgao: acao.orgao,
      dataInicio: acao.dataInicio,
      previsao: acao.previsao,
      titulo: acao.titulo,
      descricao: acao.descricao,
      tematica: acao.tematica,
      valor: acao.valor,
      municipio: acao.municipio,
      administracao: [
        {
          nome: acao.administracao[0].nome,
          partido: acao.administracao[0].partido,
        },
      ],
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewAcao({
      orgao: '',
      dataInicio: '',
      previsao: '',
      titulo: '',
      descricao: '',
      tematica: '',
      valor: '',
      municipio: '',
      administracao: [
        {
          nome: '',
          partido: '',
        },
      ],
    });
    setSelectedAcao(null);
  };

  return (
    <div>
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Adicionar Ação
      </Button>

      <Modal show={showModal} onHide={handleCloseModal} class='modal'>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedAcao ? 'Atualizar Ação' : 'Adicionar Ação'}
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
                value={newAcao.orgao}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formMunicipio">
              <Form.Label>Município</Form.Label>
              <Form.Control
                type="text"
                placeholder="Inserir o município"
                name="municipio"
                value={newAcao.municipio}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formTitulo">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                placeholder="Inserir o título"
                name="titulo"
                value={newAcao.titulo}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDescricao">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Inserir a descrição"
                name="descricao"
                value={newAcao.descricao}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formTematica">
              <Form.Label>Temática</Form.Label>
              <Form.Control
                type="text"
                placeholder="Inserir a temática"
                name="tematica"
                value={newAcao.tematica}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formValor">
              <Form.Label>Valor</Form.Label>
              <Form.Control
                type="text"
                placeholder="Inserir valor"
                name="valor"
                value={newAcao.valor}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDataInicio">
              <Form.Label>Data de Início</Form.Label>
              <Form.Control
                type="text"
                placeholder="Inserir a data de início"
                name="dataInicio"
                value={newAcao.dataInicio}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPrevisao">
              <Form.Label>Data de Previsão</Form.Label>
              <Form.Control
                type="text"
                placeholder="Inserir a data de previsão"
                name="previsao"
                value={newAcao.previsao}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formNome">
              <Form.Label>Nome do Administrador</Form.Label>
              <Form.Control
                type="text"
                placeholder="Inserir o nome do administrador"
                name="nome"
                value={newAcao.administracao[0].nome}
                onChange={(e) => handleInputChangeAdmin(e, 'nome')}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPartido">
              <Form.Label>Partido do Administrador</Form.Label>
              <Form.Control
                type="text"
                placeholder="Inserir o partido do administrador"
                name="partido"
                value={newAcao.administracao[0].partido}
                onChange={(e) => handleInputChangeAdmin(e, 'partido')}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fechar
          </Button>
          <Button variant="primary" onClick={handleFormSubmit}>
            {selectedAcao ? 'Atualizar Ação' : 'Adicionar Ação'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Órgão Responsável</th>
            <th>Município</th>
            <th>Título</th>
            <th>Descrição</th>
            <th>Temática</th>
            <th>Valor</th>
            <th>Data de Início</th>
            <th>Data de Previsão</th>
            <th>Nome do Administrador</th>
            <th>Partido do Administrador</th>
            <th>Opções</th>
          </tr>
        </thead>
        <tbody>
          {acoes.map((acao) => (
            <tr key={acao.id}>
              <td>{acao.orgao}</td>
              <td>{acao.municipio}</td>
              <td>{acao.titulo}</td>
              <td>{acao.descricao}</td>
              <td>{acao.tematica}</td>
              <td>R${acao.valor}</td>
              <td>{acao.dataInicio}</td>
              <td>{acao.previsao}</td>
              <td>{acao.administracao[0].nome}</td>
              <td>{acao.administracao[0].partido}</td>
              <td>
                <Button variant="primary" onClick={() => handleUpdate(acao)}>
                  Atualizar
                </Button>
                <Button variant="danger" onClick={() => handleDelete(acao.id)}>
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

export default Acoes;
