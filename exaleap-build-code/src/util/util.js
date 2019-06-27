export default {
	formatDate(date, formatStr) {
		var  str  =  formatStr;
		var  Week  =  ['日', '一', '二', '三', '四', '五', '六'];

		str = str.replace(/yyyy|YYYY/, date.getFullYear());
		str = str.replace(/yy|YY/, (date.getYear()  %  100) > 9 ? (date.getYear()  %  100).toString() : '0'  +  (date.getYear()  %  100));
		var month = date.getMonth() + 1;
		str = str.replace(/MM/, month > 9 ? month.toString() : '0'  +  month);
		str = str.replace(/M/g, month);

		str = str.replace(/w|W/g, Week[date.getDay()]);

		str = str.replace(/dd|DD/, date.getDate() > 9 ? date.getDate().toString() : '0'  +  date.getDate());
		str = str.replace(/d|D/g, date.getDate());

		str = str.replace(/hh|HH/, date.getHours() > 9 ? date.getHours().toString() : '0'  +  date.getHours());
		str = str.replace(/h|H/g, date.getHours());
		str = str.replace(/mm/, date.getMinutes() > 9 ? date.getMinutes().toString() : '0'  +  date.getMinutes());
		str = str.replace(/m/g, date.getMinutes());
		str = str.replace(/ss|SS/, date.getSeconds() > 9 ? date.getSeconds().toString() : '0'  +  date.getSeconds());
		str = str.replace(/s|S/g, date.getSeconds());

		return  str;
	},
	GetLunarDay(solarYear, solarMonth, solarDay) {
		var CalendarData = new Array(100);
		var madd = new Array(12);
		var tgString = "甲乙丙丁戊己庚辛壬癸";
		var dzString = "子丑寅卯辰巳午未申酉戌亥";
		var numString = "一二三四五六七八九十";
		var monString = "正二三四五六七八九十冬腊";
		var weekString = "日一二三四五六";
		var sx = "鼠牛虎兔龙蛇马羊猴鸡狗猪";
		var cYear, cMonth, cDay, TheDate;
		CalendarData = new Array(0xA4B, 0x5164B, 0x6A5, 0x6D4, 0x415B5, 0x2B6, 0x957, 0x2092F, 0x497, 0x60C96, 0xD4A, 0xEA5, 0x50DA9, 0x5AD, 0x2B6, 0x3126E, 0x92E, 0x7192D, 0xC95, 0xD4A, 0x61B4A, 0xB55, 0x56A, 0x4155B, 0x25D, 0x92D, 0x2192B, 0xA95, 0x71695, 0x6CA, 0xB55, 0x50AB5, 0x4DA, 0xA5B, 0x30A57, 0x52B, 0x8152A, 0xE95, 0x6AA, 0x615AA, 0xAB5, 0x4B6, 0x414AE, 0xA57, 0x526, 0x31D26, 0xD95, 0x70B55, 0x56A, 0x96D, 0x5095D, 0x4AD, 0xA4D, 0x41A4D, 0xD25, 0x81AA5, 0xB54, 0xB6A, 0x612DA, 0x95B, 0x49B, 0x41497, 0xA4B, 0xA164B, 0x6A5, 0x6D4, 0x615B4, 0xAB6, 0x957, 0x5092F, 0x497, 0x64B, 0x30D4A, 0xEA5, 0x80D65, 0x5AC, 0xAB6, 0x5126D, 0x92E, 0xC96, 0x41A95, 0xD4A, 0xDA5, 0x20B55, 0x56A, 0x7155B, 0x25D, 0x92D, 0x5192B, 0xA95, 0xB4A, 0x416AA, 0xAD5, 0x90AB5, 0x4BA, 0xA5B, 0x60A57, 0x52B, 0xA93, 0x40E95);
		madd[0] = 0;
		madd[1] = 31;
		madd[2] = 59;
		madd[3] = 90;
		madd[4] = 120;
		madd[5] = 151;
		madd[6] = 181;
		madd[7] = 212;
		madd[8] = 243;
		madd[9] = 273;
		madd[10] = 304;
		madd[11] = 334;

		function GetBit(m, n) {
			return (m >> n) & 1;
		}
		function e2c() {
			TheDate = (arguments.length != 3) ? new Date() : new Date(arguments[0], arguments[1], arguments[2]);
			var total, m, n, k;
			var isEnd = false;
			var tmp = TheDate.getYear();
			if (tmp < 1900) {
				tmp += 1900;
			}
			total = (tmp - 1921) * 365 + Math.floor((tmp - 1921) / 4) + madd[TheDate.getMonth()] + TheDate.getDate() - 38;

			if (TheDate.getYear() % 4 == 0 && TheDate.getMonth() > 1) {
				total++;
			}
			for (m = 0;; m++) {
				k = (CalendarData[m] < 0xfff) ? 11 : 12;
				for (n = k; n >= 0; n--) {
					if (total <= 29 + GetBit(CalendarData[m], n)) {
						isEnd = true;
						break;
					}
					total = total - 29 - GetBit(CalendarData[m], n);
				}
				if (isEnd) break;
			}
			cYear = 1921 + m;
			cMonth = k - n + 1;
			cDay = total;
			if (k == 12) {
				if (cMonth == Math.floor(CalendarData[m] / 0x10000) + 1) {
					cMonth = 1 - cMonth;
				}
				if (cMonth > Math.floor(CalendarData[m] / 0x10000) + 1) {
					cMonth--;
				}
			}
		}
		function GetcDateString() {
			var tmp = "";
			// tmp += tgString.charAt((cYear - 4) % 10);
			// tmp += dzString.charAt((cYear - 4) % 12);
			// tmp += "(";
			// tmp += sx.charAt((cYear - 4) % 12);
			// tmp += ")年 ";
			if (cMonth < 1) {
				tmp += "(闰)";
				tmp += monString.charAt( - cMonth - 1);
			} else {
				tmp += monString.charAt(cMonth - 1);
			}
			tmp += "月";
			tmp += (cDay < 11) ? "初": ((cDay < 20) ? "十": ((cDay < 30) ? "廿": "三十"));
			if (cDay % 10 != 0 || cDay == 10) {
				tmp += numString.charAt((cDay - 1) % 10);
			}
			return tmp;
		}

		if (solarYear < 1921 || solarYear > 2020) {
			return "";
		} else {
			solarMonth = (parseInt(solarMonth) > 0) ? (solarMonth - 1) : 11;
			e2c(solarYear, solarMonth, solarDay);
			return GetcDateString();
		}
	},
	prefixInteger (num, n) {
		return (Array(n).join(0) + num).slice(-n);
	},
	randomNumBetween(Min,Max) {
		var Range = Max - Min;
		var Rand = Math.random();
		var num = Min + Math.round(Rand * Range); //四舍五入
		return num;
	},
	getRandomValue(range, maxBits, pointNum) {
		let reg = null;
        if(pointNum !== undefined) {
            reg = new RegExp("(\\d)(?=(?:\\d{" + pointNum + "})+$)", "g");
            return this.prefixInteger(this.randomNumBetween(range[0], range[1]), maxBits).replace(reg, '$1,');
        }
        else {
            return this.prefixInteger(this.randomNumBetween(range[0], range[1]), maxBits);
        }
	},
	getRandomPointInCircle(x, y, r) {
        let randomR = this.randomNumBetween(0, r),
            randomTheta = this.randomNumBetween(0, 360);
        return {
            x: x + randomR * Math.sin(randomTheta),
            y: y + randomR * Math.cos(randomTheta)
        }
	},
	getNodeMat(g3d, node) {
        g3d.getData3dUI(node).validate();
        return g3d.getData3dUI(node).mat;
    },
    toLocalPostion(g3d, node, worldPosition) {
        const Matrix4 = ht.Math.Matrix4,
            Vector3 = ht.Math.Vector3;
        let mat = new Matrix4().fromArray(this.getNodeMat(g3d, node)),
            matInverse = new Matrix4().getInverse(mat),
            position = new Vector3(worldPosition).applyMatrix4(matInverse);
        return position.toArray();
	},
	getP3ByAnchor3d(g3d, node, newAnchor3d) {
        let anchor3d = node.getAnchor3d(),
            xDelta = newAnchor3d.x - anchor3d.x,
            zDelta = newAnchor3d.z - anchor3d.z,
            xSize = xDelta * node.getWidth(),
            zSize = zDelta * node.getHeight(),
            p3 = node.p3();
        return this.toLocalPostion(g3d, node, [p3[0] + xSize, p3[1], p3[2] + zSize]);
	},
	deepTraverseNodes(nodes, callBack) {
        for(let i = 0, l = nodes.length; i < l; i++) {
            let node = nodes[i],
                childs = node.getChildren().toArray();
            callBack(node);
            if(childs.length > 0) {
                this.deepTraverseNodes(childs, callBack);
            }
        }
    }
};