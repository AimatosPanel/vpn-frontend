class FormatService {
  static formatBytes(bytes) {
    if (bytes === 0 || !bytes) return '0 Б';
    const k = 1024;
    const sizes = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  static formatSpeed(speedBytes) {
    if (!speedBytes || speedBytes <= 0) return '';
    return `${this.formatBytes(speedBytes)}/s`;
  }

  static formatDate(dateString) {
    if (!dateString) return 'Бессрочно';
    return new Date(dateString).toLocaleString();
  }

  static formatShortDate(dateString) {
    if (!dateString) return 'Бессрочно';
    return new Date(dateString).toLocaleDateString();
  }
  static formatRelativeTime(unixTimestamp) {
    if (!unixTimestamp || unixTimestamp === 0) return 'Не подключался';
    const seconds = Math.floor(Date.now() / 1000 - unixTimestamp);
    if (seconds < 30) return 'В сети ⚡';

    const intervals = [
      { label: 'лет', seconds: 31536000 },
      { label: 'мес.', seconds: 2592000 },
      { label: 'дн.', seconds: 86400 },
      { label: 'ч.', seconds: 3600 },
      { label: 'мин.', seconds: 60 }
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label} назад`;
      }
    }
    return 'Только что';
  }
  static formatRemainingDays(dateString) {
    if (!dateString) return { text: 'Бессрочно', style: 'text-gray-400 bg-gray-500/10 border-gray-500/20' };
    const diffTime = new Date(dateString) - new Date();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return { text: 'Срок истек', style: 'text-rose-400 bg-rose-500/10 border-rose-500/20' };
    if (diffDays <= 3) return { text: `${diffDays} дн.`, style: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
    return { text: `через ${diffDays} дн.`, style: 'text-emerald-400 bg-[#2E3C30] border-emerald-500/10' };
  }
}

export default FormatService;