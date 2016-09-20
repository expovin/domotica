import sys 
import smtplib
import inspect
import time
from email.MIMEMultipart import MIMEMultipart
from email.MIMEBase import MIMEBase
from email.MIMEText import MIMEText
from email import Encoders
from config import mail,general

emailCfg = mail()
genCfg = general()

lvl  = genCfg['Level']
LogLvl = genCfg['LogLevel']
username = emailCfg['username'] 
password = emailCfg['password'] 

def setDbgLvl(dbglvl):
    lvl = dbglvl

def sendMail(subject,body,attach):
    try:
        msg = MIMEMultipart()
        msg['Subject'] = subject 
        msg['From'] = emailCfg['from'] 
        msg['To'] = emailCfg['to'] 

        msg.attach(MIMEText(body, 'plain'))

        if(attach != 'False'):
            date = time.strftime("%Y-%m-%d")
            fileLog="/var/log/domotica/Irrigazione/"+attach+"_"+date+".log" 
            print("Invio in attach il file "+fileLog)
            part = MIMEBase('application', "octet-stream")
            part.set_payload(open(fileLog, "rb").read())

            #on the pi, the path is different, but the email is being built properly, its the smtp part..

            Encoders.encode_base64(part)
            part.add_header('Content-Disposition', 'attachment; filename="domoticaDett.json"')

            msg.attach(part)

        server = smtplib.SMTP(emailCfg['smtpServer']+":"+str(emailCfg['smtpPort']))
        server.set_debuglevel(emailCfg['debugLevel'])
        server.ehlo()
        server.starttls()
        server.login(username, password)
        server.sendmail(username, username, msg.as_string())
        server.quit()
    except smtplib.SMTPException:
        pass
        #os.system('sudo reboot now') --- actual exception action. Modified to run on windows..

def logOut(level,fileName,message):

    if(level <= lvl):
        curframe = inspect.currentframe()
        calframe = inspect.getouterframes(curframe, 2)
        callerFunc = calframe[1][3]

        date_time = time.strftime("%d/%m/%Y %X")
        print(date_time+"\t"+LogLvl[level]+"\t"+fileName+"\t"+callerFunc+"\t"+message)


if __name__ == "__main__":
    sendMail(sys.argv[1],sys.argv[2], sys.argv[3])
