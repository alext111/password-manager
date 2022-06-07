from cgi import test
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.common.alert import Alert
import asyncio
import time

async def test_firefox():
    driver = webdriver.Firefox()
    

    try:
        driver.get("http://localhost:3001")

        print("Page title is: " + driver.title)

        #navigate to website login generation and input test website
        createPasswordLink = driver.find_element(by=By.LINK_TEXT, value="Create Password").click()
        newWebsiteForm = driver.find_element(by=By.CLASS_NAME, value="form-control").send_keys("TestWebsite")
        generatePasswordButton = driver.find_element(by=By.CLASS_NAME, value="btn-primary").click()
        time.sleep(1)
        generateConfirmation = driver.switch_to.alert
        time.sleep(1)
        print(generateConfirmation.text)
        assert generateConfirmation.text == "Login information successfully created"
        time.sleep(1)
        generateConfirmation.accept()
        time.sleep(1)

        #navigate to all website info and find test website
        findAllLoginsLink = driver.find_element(by=By.LINK_TEXT, value="Find All Logins").click()
        testWebsiteLabel = driver.find_element(by=By.XPATH, value="//*[contains(text(), 'TestWebsite')]")
        assert testWebsiteLabel.text == "TestWebsite"

        #navigate to password updater and change password to new password
        updatePasswordLink = driver.find_element(by=By.LINK_TEXT, value="Update Password").click()
        time.sleep(1)
        changeWebsiteForm = driver.find_element(by=By.CLASS_NAME, value="form-control").send_keys("TestWebsite")
        time.sleep(1)
        newPasswordForm = driver.find_element(by=By.XPATH, value="//input[@placeholder='e.g. examplepassword']").send_keys("NewPassword")
        time.sleep(1)
        updatePasswordButton = driver.find_element(by=By.XPATH, value="//button[text()='Update Password' and not(@disabled)]").click()
        print(driver.find_element(by=By.CLASS_NAME, value="btn-primary").text)
        time.sleep(3)
        time.sleep(3)
        print('1')
        '''
        updateConfirmation = driver.switch_to.alert
        time.sleep(1)
        print('2')
        print(updateConfirmation.text)
        assert updateConfirmation.text == "Password successfully changed and encrypted."
        time.sleep(1)
        updateConfirmation.accept()
        time.sleep(1)
        '''

    except Exception as e:
        print("Error")
        print(e)

    finally:
        driver.quit()

asyncio.run(test_firefox())
