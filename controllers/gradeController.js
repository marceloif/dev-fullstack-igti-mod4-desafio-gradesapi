import { db } from '../models/index.js';
import { logger } from '../config/logger.js';

const Grade = db.gradeModel;

const create = async (req, res) => {
  const grade = new Grade({
    name: req.body.name,
    subject: req.body.subject,
    type: req.body.type,
    value: req.body.value,
    lastModified: Date.now(),
  });
  try {
    const data = await grade.save();
    res.send({ message: 'Grade inserida com sucesso' });
    logger.info(`POST /grade - ${JSON.stringify()}`);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || 'Algum erro ocorreu ao salvar' });
    logger.error(`POST /grade - ${JSON.stringify(error.message)}`);
  }
};

const findAll = async (req, res) => {
  const name = req.query.name;

  //condicao para o filtro no findAll
  let condition = name
    ? { name: { $regex: new RegExp(name), $options: 'i' } }
    : {};

  try {
    const dataFindAll = await Grade.find(condition);

    if (!dataFindAll) {
      res.status(404).send('Nenhuma grade encontrada!');
    } else {
      res.send(dataFindAll);
    }
    logger.info(`GET /grade`);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || 'Erro ao listar todos os documentos' });
    logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
  }
};

const findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const dataFindOne = await Grade.findById({ _id: id });

    if (!dataFindOne) {
      res
        .status(404)
        .send(`Nenhuma grade encontrada com o ID: ${id} informado!`);
    } else {
      res.send(dataFindOne);
    }
    logger.info(`GET /grade - ${id}`);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao buscar o Grade id: ' + id });
    logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
  }
};

const update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Dados para atualizacao vazio',
    });
  }

  const id = req.params.id;

  try {
    const dataUpdate = await Grade.findByIdAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    if (!dataUpdate) {
      res.status(404).send(`Nenhuma grade encontrada para atualizar!`);
    } else {
      res.send(dataUpdate);
    }
    logger.info(`PUT /grade - ${id} - ${JSON.stringify(req.body)}`);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao atualizar a Grade id: ' + id });
    logger.error(`PUT /grade - ${JSON.stringify(error.message)}`);
  }
};

const remove = async (req, res) => {
  const id = req.params.id;

  try {
    const dataDelete = await Grade.findByIdAndRemove({ _id: id });
    if (!dataDelete) {
      res.status(404).send('Nenhuma grade encontrada para efetuar a exclusão!');
    } else {
      res.send('Grade excluída com sucesso!');
    }
    logger.info(`DELETE /grade - ${id}`);
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Nao foi possivel deletar o Grade id: ' + id });
    logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
  }
};

const removeAll = async (req, res) => {
  try {
    const dataDeleteAll = await Grade.deleteMany();

    if (!dataDeleteAll) {
      res.status(404).send('Nenhuma grade encontrada para exclusão!');
    } else {
      res.send('Grades excluídas com sucesso!');
    }
    logger.info(`DELETE /grade`);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao excluir todas as Grades' });
    logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
  }
};

export default { create, findAll, findOne, update, remove, removeAll };
