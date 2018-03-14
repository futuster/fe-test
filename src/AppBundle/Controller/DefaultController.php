<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function indexAction(Request $request)
    {
        return $this->render('default/index.html.twig');
    }

    /**
     * @Route("/api/employee", name="employee_api_list")
     */
    public function employeeApiAction()
    {
        return new JsonResponse([
            [
                'id' => 1,
                'name' => 'Константинопольский Константин Константинович',
                'gender' => 'м',
                'age' => 32,
                'position' => 'тестировщик',
            ],
            [
                'id' => 2,
                'name' => 'Иванов Пётр',
                'gender' => 'м',
                'age' => 54,
                'position' => 'системный администратор',
            ],
            [
                'id' => 3,
                'name' => 'Протопенко Светлана',
                'gender' => 'ж',
                'age' => 19,
                'position' => 'офис менеджер',
            ],
            [
                'id' => 5,
                'name' => 'Энди Вачовски',
                'gender' => '?',
                'age' => 50,
                'position' => 'режисер',
            ],
        ]);
    }
}
