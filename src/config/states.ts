const staff = {
  normal: {
    name: 'Normal',
    es_name: 'Normal',
    zh_name: '普通的',
    value: 'normal',
    position: 1,
  },
  frezze: {
    name: 'Frezze',
    es_name: 'Congelar',
    zh_name: '冻结',
    value: 'frezze',
    position: 2,
  },
  resign: {
    name: 'Resign',
    es_name: 'Renunciar',
    zh_name: '放弃',
    value: 'resign',
    position: 3,
  },
};

const user = {
  normal: {
    name: 'Normal',
    es_name: 'Normal',
    zh_name: '普通的',
    value: 'normal',
    position: 1,
  },
  frezze: {
    name: 'Frezze',
    es_name: 'Congelar',
    zh_name: '冻结',
    value: 'frezze',
    position: 2,
  },
  pending_payment: {
    name: 'Pending payment',
    es_name: 'Pendiente de pago',
    zh_name: '杰出的',
    value: 'pending payment',
    position: 3,
  },
};

const warehouse = {
  normal: {
    name: 'Normal',
    es_name: 'Normal',
    zh_name: '普通的',
    value: 'normal',
    position: 1,
  },
  frezze: {
    name: 'Frezze',
    es_name: 'Congelar',
    zh_name: '冻结',
    value: 'frezze',
    position: 2,
  },
  close: {
    name: 'Close',
    es_name: 'Cerrar',
    zh_name: '关闭',
    value: 'close',
    position: 3,
  },
};

const output_plan = {
  pending: {
    name: 'Pending',
    es_name: 'Pendiente',
    zh_name: '耳环',
    value: 'pending',
    position: 1,
  },
  to_be_processed: {
    name: 'To be processed',
    es_name: 'Para ser procesado',
    zh_name: '待处理',
    value: 'to_be_processed',
    position: 2,
  },
  /* collecting: {
    name: 'Collecting',
    es_name: 'Recogiendo',
    zh_name: '收藏',
    value: 'collecting',
    position: 3,
  }, */
  processing: {
    name: 'Processing',
    es_name: 'Procesando',
    zh_name: '选一个',
    value: 'processing',
    position: 4,
  },
  dispatched: {
    name: 'Dispatched',
    es_name: 'Despachado',
    zh_name: '已派遣',
    value: 'dispatched',
    position: 5,
  },
  cancelled: {
    name: 'Cancelled',
    es_name: 'Cancelado',
    zh_name: '取消',
    value: 'cancelled',
    position: 6,
  },
  all: {
    name: 'All',
    es_name: 'Todos',
    zh_name: '全部',
    value: 'all',
    position: 7,
  },
};

const operation_instruction = {
  pending: {
    name: 'Pending',
    es_name: 'Pendiente',
    zh_name: '耳环',
    value: 'pending',
    position: 1,
  },
  processing: {
    name: 'Processing',
    es_name: 'Procesando',
    zh_name: '加工',
    value: 'processing',
    position: 2,
  },
  processed: {
    name: 'Processed',
    es_name: 'Procesado',
    zh_name: '处理',
    value: 'processed',
    position: 3,
  },
  /* audited: {
    name: 'Audited',
    es_name: 'Auditado',
    zh_name: '已审核',
    value: 'audited',
    position: 4,
  }, */
  cancelled: {
    name: 'Cancelled',
    es_name: 'Cancelado',
    zh_name: '取消',
    value: 'cancelled',
    position: 5,
  },
  all: {
    name: 'All',
    es_name: 'Todos',
    zh_name: '全部',
    value: 'all',
    position: 6,
  },
};
const entry_plan = {
  to_be_storage: {
    name: 'Pending',
    es_name: 'Pendientes',
    zh_name: '待存储',
    value: 'to be storage',
    position: 1,
  },
  into_warehouse: {
    name: 'Entry into warehouse',
    es_name: 'Procesando entrada',
    zh_name: '进入仓库',
    value: 'into warehouse',
    position: 2,
  },
  stocked: {
    name: 'Stocked',
    es_name: 'Almacenado',
    zh_name: '库存充足',
    value: 'stocked',
    position: 3,
  },
  cancelled: {
    name: 'Cancelled',
    es_name: 'Cancelado',
    zh_name: '取消',
    value: 'cancelled',
    position: 4,
  },
};

const regional_division = {
  reception_area: {
    name: 'Reception area',
    es_name: 'Área de recepción',
    zh_name: '接待区',
    value: 'reception_area',
    position: 1,
  },
  delivery_area: {
    name: 'Delivery area',
    es_name: 'Zona de entrega',
    zh_name: '送货范围',
    value: 'delivery_area',
    position: 2,
  },
};

const states = {
  staff,
  user,
  warehouse,
  output_plan,
  operation_instruction,
  entry_plan,
  regional_division,
};
export default states;
