

// fix: Update formatCurrency to accept Intl.NumberFormatOptions
export const formatCurrency = (amount: number, options?: Intl.NumberFormatOptions): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    ...options,
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const exportToCsv = (filename: string, rows: (string | number)[][]) => {
    const processRow = (row: (string | number)[]) => {
        let finalVal = '';
        for (let j = 0; j < row.length; j++) {
            let innerValue = row[j] === null || row[j] === undefined ? '' : String(row[j]);
            if (String(row[j]).includes(',')) {
                innerValue = '"' + innerValue + '"';
            }
            if (j > 0) {
                finalVal += ',';
            }
            finalVal += innerValue;
        }
        return finalVal + '\n';
    };

    let csvFile = '';
    for (let i = 0; i < rows.length; i++) {
        csvFile += processRow(rows[i]);
    }

    const blob = new Blob([csvFile], { type: 'text/csv;charset=utf-s_8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
