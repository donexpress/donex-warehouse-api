const operation_instruction_type = {
  change_label: {
    name: 'Change the Label',
    es_name: 'Reetiquetar',
    zh_name: '换标',
    value: 'change label',
    position: 1,
  },
  photograph: {
    name: 'Photograph',
    es_name: 'Fotografía',
    zh_name: '拍照',
    value: 'photograph',
    position: 2,
  },
  change_boxes: {
    name: 'Change Boxes',
    es_name: 'Caja de Cambio',
    zh_name: '换箱',
    value: 'change boxes',
    position: 3,
  },
  count_boxes: {
    name: 'Count Boxes',
    es_name: 'Casilla de Verificacion',
    zh_name: '清点货箱',
    value: 'count boxes',
    position: 4,
  },
  count_sku: {
    name: 'Count SKUs',
    es_name: 'Consultar SKU',
    zh_name: '清点SKU',
    value: 'count_sku',
    position: 5,
  },
  repair: {
    name: 'Repair',
    es_name: 'Reparar',
    zh_name: '维修',
    value: 'repair',
    position: 6,
  },
  destroy: {
    name: 'Destroy',
    es_name: 'Destruir',
    zh_name: '销毁',
    value: 'destroy',
    position: 7,
  },
};

const warehouse_type = { operation_instruction_type };

export default warehouse_type;
