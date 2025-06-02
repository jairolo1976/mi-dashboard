export function clasificarCategoria(edad: number): string {
    const ano = new Date().getFullYear() - edad;
    if (ano >= 2018 && ano <= 2019) return 'Prebenjamín';
    if (ano >= 2016 && ano <= 2017) return 'Benjamín';
    if (ano >= 2014 && ano <= 2015) return 'Alevín';
    if (ano >= 2012 && ano <= 2013) return 'Infantil';
    if (ano >= 2010 && ano <= 2011) return 'Cadete';
    if (ano >= 2007 && ano <= 2009) return 'Juvenil';
    if (ano <= 2006) return 'Senior';
    return 'Sin categoría';
  }