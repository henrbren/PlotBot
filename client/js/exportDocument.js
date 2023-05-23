exportDocumentAsPDF = async function (type, NGCDocument, NGCEditor) {
  /*pdfMake.fonts = {
		Helvetica: {
			normal: 'Helvetica',
			bold: 'Helvetica-Bold',
			italics: 'Helvetica-Oblique',
			bolditalics: 'Helvetica-BoldOblique'
		},
	};*/

  let bookWriter = document.getElementById("bookWriter");
  let bookTitle = document.getElementById("bookTitle");
  let bookSynopsis = document.getElementById("synopsis");
  let textLength = document.getElementById("textLength");
  let orientation = "portrait";
  let image = globalImageBase64;

  let demoVersion = false;

  let sysName = "Spøkelse.no";
  var dd = {
    footer: function (currentPage, pageCount) {
      return [
        {
          text: "Side " + currentPage.toString() + " av " + pageCount,
          alignment: "center",
        },
      ];
    },
    info: {
      title: bookTitle.value,
      author: bookWriter.value,
      subject: bookTitle.value,
      keywords: sysName,
      creator: sysName,
      producer: sysName,
    },
    permissions: {
      modifying: true,
      copying: true,
      annotating: true,
    },
    pageOrientation: orientation,
    content: [],
    styles: {
      header: {
        fontSize: 20,
        bold: true,
        margin: [0, 20],
        color: "#4a5c69",
        padding: 10,
        background: "#fff",
      },
      superheader: {
        fontSize: 30,
        background: "#000",
        bold: true,
        color: "#fff",
        padding: 20,
      },
      tableExample: {
        margin: [0, 5, 0, 15],
        fontSize: 10,
      },
      tableHeader: {
        bold: false,
        fontSize: 11,
        color: "#FFFFFF",
        fillColor: "#4a5c69",
      },
    },

    defaultStyle: {
      //font: 'Helvetica',
      b: {
        bold: true,
      },
      strong: {
        bold: true,
      },
      u: {
        decoration: "underline",
      },
      s: {
        decoration: "lineThrough",
      },
      em: {
        italics: true,
      },
      i: {
        italics: true,
      },
      h1: {
        fontSize: 16,
        bold: true,
        color: "#4a5c69",
        margin: [0, 15],
      },
      h2: {
        fontSize: 13,
        bold: true,
        margin: [0, 15],
      },
      h3: {
        fontSize: 12,
        bold: false,
        margin: [0, 15],
      },
      h4: {
        fontSize: 11,
        bold: true,
        marginBottom: 5,
      },
      h5: {
        fontSize: 11,
        bold: false,
        marginBottom: 5,
      },
      h6: {
        fontSize: 10,
        bold: false,
        marginBottom: 5,
      },
      a: {
        color: "#4a5c69",
        decoration: "underline",
      },
      strike: {
        decoration: "lineThrough",
      },
      p: {
        margin: [0, 5, 0, 10],
      },
      ul: {
        marginBottom: 5,
      },
      li: {
        marginLeft: 5,
        marginBottom: 5,
      },
      table: {
        marginBottom: 5,
      },
      th: {
        bold: false,
        fillColor: "#EEEEEE",
      },
    },
    pageBreakBefore: function (
      currentNode,
      followingNodesOnPage,
      nodesOnNextPage,
      previousNodesOnPage
    ) {
      return (
        currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0
      );
    },
  };

  dd.permissions.modifying = true;
  dd.permissions.copying = true;
  dd.permissions.annotating = true;

  let DataToPDF = editor.getData();

  var val = htmlToPdfmake(DataToPDF);

  dd.content.push(val);
  console.log("Starter parsing...");

  let svgColor1 = "#fff";
  let svgColor2 = "#fff";
  let svgColor3 = "purple";
  let firstPageSvg, nameX, nameY, compX, compY;

  if (orientation === "landscape") {
    firstPageSvg =
      '<svg viewBox="0 0 841.9 595.3" xml:space="preserve"><style type="text/css">.st0{fill:' +
      svgColor1 +
      ";}.st1{fill:" +
      svgColor3 +
      ';}}</style><rect class="st0" width="841.9" height="595.3"/><rect x="53" y="460" class="st1" width="326.2" height="43.9"/></svg>';
    nameX = 600;
    nameY = 530;
    compX = 600;
    compY = 500;
  } else {
    firstPageSvg =
      '<svg viewBox="0 0 595.3 841.9" xml:space="preserve"><style type="text/css">.st0{fill:' +
      svgColor1 +
      ";}.st1{fill:" +
      svgColor3 +
      ';}}</style><rect class="st0" width="595.3" height="841.9"/><rect x="53" y="460" class="st1" width="326.2" height="43.9"/></svg>';
    nameX = 200;
    nameY = 765;
    compX = 200;
    compY = 745;
  }

  var header = {
    stack: [
      {
        text: bookTitle.value,
        style: "superheader",
        absolutePosition: {
          x: 53,
          y: 100,
        },
        width: "700",
      },
      {
        text: bookWriter.value,
        style: "header",
        absolutePosition: {
          x: 53,
          y: 140,
        },
      },

      {
        text: "Skrevet av: " + bookWriter.value,
        color: "#4a5c69",
        absolutePosition: {
          x: compX,
          y: compY,
        },
      },
      {
        text: "PlotBot",
        color: "#4a5c69",
        absolutePosition: {
          x: nameX,
          y: nameY,
        },
        pageBreak: "after",
      },
    ],
  };

  if (image) {
    let base64image = "data:image/png;base64," + image;
    header.stack.unshift({
      absolutePosition: {
        x: 0,
        y: 0,
      },
      width: "842",
      image: base64image,
    });
  }

  /*let nkfLogo = getBase64ImageFromURL('icon.png');
	header.stack.unshift({
		absolutePosition: {
			x: 55,
			y: 745
		},
		width: '100',
		image: await nkfLogo,
	});*/

  header.stack.unshift({
    absolutePosition: {
      x: 0,
      y: 0,
    },
    svg: firstPageSvg,
  });

  //

  dd.content.unshift(header);

  if (demoVersion) {
    dd.watermark = {
      text: " D E M O ",
      color: "red",
      opacity: 0.8,
      bold: true,
      italics: false,
    };
  } else {
    dd.watermark = {
      text: " PlotBot ",
      color: "blue",
      opacity: 0.05,
      bold: true,
      italics: false,
    };
  }

  console.log("Gjør klar til å opprette fil...");
  //Vi sjekker her om brukeren har AdBlock. Hvis ja, er vi nødt til å laste ned filen.
  //ZoYUhVesRpfk er ID til en simulert, falsk annonse
  if (document.getElementById("ZoYUhVesRpfk")) {
    if (type == "tab") {
      pdfMake.createPdf(dd).open();
      console.log("Ferdig - åpner i fane");
    } else {
      pdfMake.createPdf(dd).download();
      console.log("Ferdig - laster ned");
    }
  } else {
    pdfMake.createPdf(dd).download();
  }

  console.groupEnd();
};

function getBase64ImageFromURL(url) {
  return new Promise((resolve, reject) => {
    var img = new Image();
    img.setAttribute("crossOrigin", "anonymous");

    img.onload = () => {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      var dataURL = canvas.toDataURL("image/png");

      resolve(dataURL);
    };

    img.onerror = (error) => {
      reject(error);
    };

    img.src = url;
  });
}
