CREATE DATABASE IF NOT EXISTS comic_con_buddy CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE comic_con_buddy;

CREATE TABLE IF NOT EXISTS merchants (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  eta VARCHAR(50) NOT NULL,
  price VARCHAR(50) NOT NULL,
  score VARCHAR(10) NOT NULL,
  description TEXT NOT NULL,
  hot VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL,
  tags_json JSON NOT NULL,
  online_status VARCHAR(30) NOT NULL DEFAULT '在线',
  current_zone VARCHAR(100) NOT NULL,
  credit_score INT NOT NULL DEFAULT 100,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  merchant_name VARCHAR(100) NOT NULL,
  status VARCHAR(30) NOT NULL,
  detail TEXT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS buddies (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  purpose VARCHAR(50) NOT NULL,
  role VARCHAR(50) NOT NULL,
  available_time VARCHAR(50) NOT NULL,
  vibe VARCHAR(50) NOT NULL,
  tags_json JSON NOT NULL,
  intro TEXT NOT NULL,
  credit_score INT NOT NULL DEFAULT 100,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS invitations (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  buddy_name VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  eta VARCHAR(50) NOT NULL,
  price VARCHAR(50) NOT NULL,
  badge VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  service_name VARCHAR(100) NOT NULL,
  contact_name VARCHAR(100) NOT NULL,
  slot_time VARCHAR(100) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'booked',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS venues (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS venue_spots (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  venue_id BIGINT NOT NULL,
  title VARCHAR(100) NOT NULL,
  tag VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_venue_spots_venue FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS queue_options (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  area VARCHAR(100) NOT NULL,
  wait_text VARCHAR(50) NOT NULL,
  slot_time VARCHAR(50) NOT NULL,
  status_text VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  booked TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reminders (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL,
  remind_time VARCHAR(20) NOT NULL,
  tag VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  enabled TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS travel_options (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL,
  mode VARCHAR(50) NOT NULL,
  eta VARCHAR(50) NOT NULL,
  cost VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  selected TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO merchants (name, category, eta, price, score, description, hot) VALUES
('樱桃汽泡补给站', '奶茶', '18 分钟送达', '￥22 起', '4.9', '高颜值奶茶和应援杯套，适合边逛边拿。', '桃桃气泡波波'),
('次元便当研究所', '主食', '26 分钟送达', '￥34 起', '4.8', '热食便当、饭团和意面，适合长线逛展补充体力。', '照烧鸡排饭团'),
('应援急救小铺', '应急用品', '12 分钟送达', '￥9 起', '4.9', '补妆棉签、发夹、充电线、防走光贴一站补齐。', '便携定妆补给包');

INSERT INTO users (name, role, tags_json, online_status, current_zone, credit_score) VALUES
('星野七', 'COSER', JSON_ARRAY('互拍', '逛摊', '补妆'), '在线', 'A馆主舞台', 98),
('阿澄', '摄影', JSON_ARRAY('互拍', '返图快', '侧馆空景'), '在线', 'B馆摄影区', 95),
('眠眠', '妆造', JSON_ARRAY('补妆', '修假发', '中午可接'), '忙碌中', '北门服务区', 93),
('谷子熊', '普通用户', JSON_ARRAY('吃谷', '舞台', '拼返程'), '在线', 'A馆主舞台', 90);

INSERT INTO buddies (name, purpose, role, available_time, vibe, tags_json, intro, credit_score) VALUES
('铃音', '逛摊+吃谷', 'LOLITA', '全天', '社牛一点点', JSON_ARRAY('同人本', '谷子', '奶茶控'), '想找能一起冲热门摊位、顺便拍几张日常感照片的搭子。', 96),
('阿澄', '摄影互拍', 'COSER', '下午', '偏安静', JSON_ARRAY('互拍', '返图快', '不赶场'), '主要去 B 馆拍照，想找节奏合适、愿意互相看构图的搭子。', 94);

INSERT INTO services (name, category, eta, price, badge, description) VALUES
('化妆师补妆预约', '化妆补妆', '8 分钟可接待', '￥39 / 次', '热门', '适合底妆斑驳、唇妆掉色、睫毛开胶等快速补救。'),
('毛娘修假发预约', '修假发', '12 分钟可接待', '￥58 / 次', '高需求', '修碎发、前额、发网外露和假发松动，适合拍摄前急救。'),
('摄影预约分流', '摄影分流', '即时响应', '免费', '效率提升', '按空闲摄影师与场地拥堵程度推荐更合适的拍摄点位。'),
('摄影预约档期', '摄影预约', '15 分钟内确认', '￥29 订金', '高转化', '先锁定摄影时段，再根据拥挤度自动推荐更顺的拍摄路线。');

INSERT INTO venues (name, note) VALUES
('A馆主舞台', '活动密度最高，适合优先看舞台和官方互动，当前人流较高。'),
('B馆摄影区', '适合摄影和约拍，主通道容易拥堵，建议按拍摄时段分流。');

INSERT INTO venue_spots (venue_id, title, tag, description) VALUES
(1, '官方主舞台', '排队 18 分钟', '签售、互动演出与主舞台活动集中在这里。'),
(1, '饮品补给点', '配送点', '支持奶茶与轻食自提，也是搭子集合的热门点。'),
(2, '主摄影棚入口', '拥堵', '人流高峰建议先预约摄影再入场。'),
(2, '侧馆空景区', '推荐', '更适合拍单人和双人，背景干净。');

INSERT INTO queue_options (name, area, wait_text, slot_time, status_text, description, booked) VALUES
('主摄影棚黄金档', 'B馆摄影区', '排队 25 分钟', '14:00 - 14:30', '可预约', '适合正片拍摄，棚内背景稳定，人流偏高。', 0),
('侧馆空景区', 'B馆摄影区', '排队 8 分钟', '14:30 - 15:00', '推荐', '适合双人互拍和快速出片，移动更灵活。', 0),
('北门快修补妆位', '北门服务区', '排队 6 分钟', '13:40 - 14:00', '低等待', '补妆后可以直接转场去摄影区，不容易耽误档期。', 0),
('摄影预约档期', '预约服务', '15 分钟确认', '16:00 - 16:40', '可锁档', '先锁摄影师时段，再根据馆内拥挤度调整机位。', 0);

INSERT INTO reminders (title, remind_time, tag, description, enabled) VALUES
('补妆提醒', '12:10', '妆造', '午间高温前提醒补一次定妆，避免下午妆面脱得太厉害。', 1),
('摄影转场提醒', '15:20', '摄影', '主摄影区拥堵时自动提醒你切到侧馆空景区。', 0),
('返程提醒', '18:00', '交通', '散场前 30 分钟提醒去拼车点或提前叫车。', 1),
('取餐提醒', '11:50', '补给', '订单快送到时提醒你去休息区或服务台取餐。', 0);

INSERT INTO travel_options (title, mode, eta, cost, description, selected) VALUES
('北门拼车', '拼车', '5 分钟内可发车', '约 ￥18 / 人', '适合和搭子一起返程，省时间也更稳。', 0),
('东侧地铁口', '地铁', '步行 9 分钟', '常规票价', '当前人流较低，适合不赶时间的返程路线。', 0),
('主门网约车区', '打车', '等待 18 分钟', '动态计价', '高峰期排队更久，建议提前 30 分钟开始准备。', 0),
('搭子同行返程', '结伴', '即时发起', 'AA', '适合和同馆区搭子拼车或一起走地铁，提高安全感。', 0);
