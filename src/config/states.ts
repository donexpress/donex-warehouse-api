const staff = {
  normal: {
    name: 'Normal',
    es_name: 'Normal',
    zh_name: '普通的',
    value: "normal",
    position: 1,
  },
  frezze: {
    name: 'Frezze',
    es_name: 'Congelar',
    zh_name: '冻结',
    value: "frezze",
    position: 2,
  },
  resign: {
    name: 'Resign',
    es_name: 'Renunciar',
    zh_name: '放弃',
    value: "resign",
    position: 3,
  },
};

const user = {
  normal: {
    name: 'Normal',
    es_name: 'Normal',
    zh_name: '普通的',
    value: "normal",
    position: 1,
  },
  frezze: {
    name: 'Frezze',
    es_name: 'Congelar',
    zh_name: '冻结',
    value: "frezze",
    position: 2,
  },
  pending_payment: {
    name: 'Pending payment',
    es_name: 'Pendiente de pago',
    zh_name: '杰出的',
    value: "pending payment",
    position: 3,
  },
};

const warehouse = {
  normal: {
    name: 'Normal',
    es_name: 'Normal',
    zh_name: '普通的',
    value: "normal",
    position: 1,
  },
  frezze: {
    name: 'Frezze',
    es_name: 'Congelar',
    zh_name: '冻结',
    value: "frezze",
    position: 2,
  },
  close: {
    name: 'Close',
    es_name: 'Cerrar',
    zh_name: '关闭',
    value: "close",
    position: 3,
  },
};

const output_plan = {
  pending: {
    name: 'Pending',
    es_name: 'Pendiente',
    zh_name: '耳环',
    value: "pending",
    position: 1,
  },
  to_be_chosen: {
    name: 'To be chosen',
    es_name: 'Para ser elegido',
    zh_name: '待选',
    value: "to_be_chosen",
    position: 2,
  },
  collecting: {
    name: 'Collecting',
    es_name: 'Recogiendo',
    zh_name: '收藏',
    value: "collecting",
    position: 3,
  },
  chooze: {
    name: 'Chooze',
    es_name: 'Elegido',
    zh_name: '选一个',
    value: "collecting",
    position: 4,
  },
  exhausted: {
    name: 'Exhausted',
    es_name: 'Agotado',
    zh_name: '筋疲力尽的',
    value: "exhausted",
    position: 5,
  },
  cancelled: {
    name: 'Cancelled',
    es_name: 'Cancelado',
    zh_name: '取消',
    value: "cancelled",
    position: 6,
  },
  all: {
    name: 'All',
    es_name: 'Todos',
    zh_name: '全部',
    value: "all",
    position: 7,
  },
};

const states = { staff, user, warehouse, output_plan };

export default states;
