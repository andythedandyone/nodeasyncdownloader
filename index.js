//const url = "ftp://ftp.uconn.edu/48_hour/";
const url = "ftp://pubftp.spp.org/Markets/DA/BINDING_CONSTRAINTS/2018/05/By_Day/";
const { spawn } = require("child_process");
const folders = [];
const ls = spawn('curl', [url]);

ls.stdout.on('data', (data) => {
	folders.push(...data.toString().split('\n'));
});


ls.on('close', data => {

//	console.log('done', folders);
	for (let i = 0; i < folders.length; i++) {
		let temp = folders[i].split(' ');
//		console.log(temp);
		if (temp[temp.length - 1].split('.')[1] == 'csv') {
			const fUrl = `${url}${temp[temp.length - 1]}`;
			console.log(fUrl);
			const download = spawn('curl', [fUrl, '--output', '/home/andy/Desktop/Code/snippet/random/js/ftpfiles/data' + temp[temp.length - 1]]);
			download.on('close', data => console.log("File Download -> ", temp[temp.length -1]));
		}
	}
})

