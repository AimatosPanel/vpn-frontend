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
}

export default FormatService;