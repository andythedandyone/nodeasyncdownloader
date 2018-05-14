//const url = "ftp://pubftp.spp.org/Markets/DA/BINDING_CONSTRAINTS/2017/01/By_Day

const url = "ftp://pubftp.spp.org/Markets/DA/BINDING_CONSTRAINTS/";
const { spawn } = require("child_process");
const folders = [];
const data_folder = './data'; // the folder path to where you want to downalod the files to.

// choose the range dates you want to download your files.
// recommended to stay within a year from start to current.
// example; 
// fromYear: 2016
// fromMonth: 1
// currentYear: 2016
// currentMonth: 12
// and so on.
// You may download up to 2 years of data at a time, however this will take some
// time depending on your computer resources and internet speed.
const searchBase = {
	fromYear: 2015,
	fromMonth: 1,
	currentYear: 2016,
	currentMonth: 11
}

// scan the base folder by providing the search settings and base url
const parseFtpFolders = (base, url) => {
	const unit = 12;
	let month = base.fromMonth;
	let year = base.fromYear;
	let gate = true;
	const urls = [];
	while (gate) {
	
		if (year == base.currentYear && month == base.currentMonth) {
			gate = false;
		}
		if (unit  < month) {
			year++
			month = 1;
		}
		urls.push(`${url}${year}/${month < 10 ? '0' + month: month}/By_Day/`);
		month++;
	}
	downloadFiles(urls);
}

// map thru the urls received from parse folder and Q the files and download it
// async each file.
const downloadFiles = (dUrl) => 
{
	for (let i = 0; i < dUrl.length; i++) {
		const ls = spawn('curl', [dUrl[i]]);
		console.log("urls --> ", dUrl[i]);

		ls.stdout.on('data', (data) => {
			console.log(data.toString());
			folders.push(...data.toString().split('\n'));
		});
		ls.on('close', data => {
			for (let x = 0; x < folders.length; x++) {
				let temp = folders[x].split(' ');
				console.log(temp);
				if (temp[temp.length - 1].split('.')[1] == 'csv') {
					const fUrl = `${dUrl[i]}${temp[temp.length - 1]}`;
					console.log("-------->>>> ", fUrl);
					const download = spawn('curl', [fUrl, '--output', `${data_folder}/${temp[temp.length - 1]}`]);
					download.on('close', data => console.log("File Download from -> ", fUrl));
				}
			}
		})
	}
}

parseFtpFolders(searchBase, url);
